import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConfirmCode } from './entities/auth.entity';
import { JwtPayload } from 'jsonwebtoken';
import { SmsNikitaService } from 'src/services/sms-nikita.ts/sms-nikita.service';
import { ConfrimCodeDto } from './dto/confrim-code.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ConfirmAccountDto } from './dto/confirm-account.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(ConfirmCode)
    private readonly confirmCodesRepository: Repository<ConfirmCode>,
    private readonly smsNikitaService: SmsNikitaService,
  ) {}

  private createPayload(user: User): JwtPayload {
    return {
      id: user.id,
      firstName: user.firstName,
      phoneNumber: user.phoneNumber,
      role: user.role,
    };
  }

  async validateUser(phoneNumber: string) {
    if (!phoneNumber) {
      throw new BadRequestException('Not proper credentials');
    }

    const user = await this.userService.findOne(phoneNumber);

    if (!user) {
      throw new BadRequestException('User not found!');
    }

    if (!user.confirmed) {
      throw new UnauthorizedException('Account is not confirmed!');
    }

    return user;
  }

  async signup(createUserDto: CreateUserDto) {
    const { phoneNumber } = createUserDto;

    if (await this.userService.checkIfUserExists(phoneNumber)) {
      throw new BadRequestException('User already exists');
    }

    const codeToConfirm = Math.random().toString().substr(2, 4);
    const newUser = await this.userService.create(createUserDto);

    this.smsNikitaService.sendSms(phoneNumber, codeToConfirm);
    newUser.confirm_code = codeToConfirm;
    await this.userRepository.save(newUser);
    return newUser;
  }

  async confirmAccount(codeToConfirm: string) {
    const account = await this.userRepository.findOne({
      where: { confirm_code: codeToConfirm },
    });
    if (!account) {
      throw new BadRequestException('NOT FOUND!');
    }
    await this.userService.activateUser(account.id);
    const payload = this.createPayload(account);
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  private async sendConfirmationCode(phoneNumber: string): Promise<any> {
    //тут был void
    const codeToConfirm = Math.random().toString().substr(2, 4);
    const confirmCode = new ConfirmCode();
    confirmCode.phoneNumber = phoneNumber;
    confirmCode.code = codeToConfirm;
    await this.confirmCodesRepository.save(confirmCode);
    this.smsNikitaService.sendSms(phoneNumber, codeToConfirm);
    return codeToConfirm;
  }

  async sendVerifyCode(phoneNumber: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { phoneNumber } });
    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }
    if (!user.confirmed) {
      throw new BadRequestException('Пользователь ещё не зарегистрирован!');
    }
    const loginCode = await this.sendConfirmationCode(phoneNumber);
    user.login_code = loginCode;
    await this.userRepository.save(user);
    console.log('Полученный код подтверждения:', loginCode);
  }

  async verifyCode(
    verificationCode: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findOne({
      where: { login_code: verificationCode },
    });
    if (!user) {
      throw new BadRequestException('Неправильный код подтверждения');
    }
    const userPayload = await this.createPayload(user);
    const accessToken = this.generateAccessToken(userPayload);
    const refreshToken = this.generateRefreshToken();
    user.refresh_token = refreshToken;
    await this.userRepository.save(user);
    return { accessToken, refreshToken };
  }

  private generateAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(): string {
    const validityPeriod = 30 * 24 * 60 * 60 * 1000; // 30 days in millis
    const expirationDate = Date.now() + validityPeriod;
    const token =
      randomBytes(40).toString('hex') + '.' + expirationDate.toString();
    return token;
  }

  async refreshAccessToken(refresh_token: string) {
    const user = await this.userRepository.findOne({
      where: { refresh_token: refresh_token },
    });
    if (!user) {
      throw new UnauthorizedException('Refresh token is invalid');
    }
    const payload = await this.createPayload(user);
    const access_token = this.jwtService.sign(payload);
    return {
      access_token,
    };
  }
}
