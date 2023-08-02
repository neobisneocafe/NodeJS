import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  ConflictException,
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
import { Admin } from './entities/admins.entity';
import { LoginAdminDto } from './dto/admin.dto';
import { ListParamsDto } from 'src/base/dto/list-params.dto';
import { ListDto } from 'src/base/dto/list.dto';

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
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
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
    const confirmCode = {
      phoneNumber,
      code: codeToConfirm,
    };
    await this.saveConfirmCode(confirmCode);
    this.smsNikitaService.sendSms(phoneNumber, codeToConfirm);
    const newUser = await this.userService.create(createUserDto);
    return newUser;
  }

  async saveConfirmCode(confirmCodeDto: ConfrimCodeDto) {
    const existingCode = await this.confirmCodesRepository.findOneBy({
      phoneNumber: confirmCodeDto.phoneNumber,
    });
    if (existingCode) {
      await this.confirmCodesRepository.remove(existingCode);
    }
    const newCode = new ConfirmCode();
    newCode.phoneNumber = confirmCodeDto.phoneNumber;
    newCode.code = confirmCodeDto.code;
    return this.confirmCodesRepository.save(newCode);
  }

  async confirm(confirmAccountDto: ConfirmAccountDto) {
    const { code, phoneNumber } = confirmAccountDto;

    const sentAccount = await this.confirmCodesRepository.findOne({
      where: {
        phoneNumber,
      },
    });

    if (!sentAccount || code !== sentAccount.code) {
      throw new BadRequestException('Incorrect credentials');
    }

    const currentTime = Date.now();
    const createdAt = sentAccount.createdAt.getTime();
    const timeDifference = (currentTime - createdAt) / (1000 * 60); // Разница в минутах
    const tenMinutes = 10;
    if (timeDifference > tenMinutes) {
      await this.confirmCodesRepository.remove(sentAccount);
      throw new BadRequestException(
        'Code has expired. Please send a new code within 10 minutes.',
      );
    }

    const account = await this.userService.findOne(phoneNumber);

    await this.confirmCodesRepository.remove(sentAccount);
    await this.userService.activateUser(account.id);

    const payload = this.createPayload(account);
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
    };
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

  generateAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(): string {
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
    const admin = await this.adminRepo.findOne({
      where: { refresh_token: refresh_token },
    });
    if (!user || !admin) {
      throw new UnauthorizedException('Refresh token is invalid');
    }
    const payload = await this.createPayload(user);
    const access_token = this.jwtService.sign(payload);
    return {
      access_token,
    };
  }

  async refreshAccessTokens(refresh_token: string) {
    const user = await this.userRepository.findOne({
      where: { refresh_token },
    });
    const admin = await this.adminRepo.findOne({ where: { refresh_token } });

    if (!user && !admin) {
      throw new UnauthorizedException('Refresh token is invalid');
    }

    let payload;
    if (user) {
      payload = await this.createPayload(user); // Для пользователя
    } else {
      payload = await this.createAdminPayload(admin); // Для администратора
    }

    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }

  private createAdminPayload(admin: Admin): any {
    return {
      id: admin.id,
      username: admin.username,
      role: 'admin',
    };
  }
  // ==============================================================================================
  async create(loginDto: LoginAdminDto): Promise<Admin> {
    const adminExists = await this.adminRepo.findOne({
      where: { hasAdmin: true },
    });
    if (adminExists) {
      throw new ConflictException('Admin is already exists');
    }
    const admin = new Admin();
    // loginDto.password = Hash.make(loginDto.password);
    admin.absorbFromDto(loginDto);
    return this.adminRepo.save(admin);
  }

  async findAdminByUsername(username: string) {
    const findOnebyUsername = await this.adminRepo.findOne({
      where: { username },
    });
    return findOnebyUsername;
  }

  async login(login: LoginAdminDto) {
    const admin = await this.adminRepo.findOne({
      where: { username: login.username },
    });
    if (!admin) {
      throw new UnauthorizedException();
    }
    const payload = this.createAdminPayload(admin);
    const refreshToken = this.generateRefreshToken();
    admin.refresh_token = refreshToken;
    admin.hasAdmin = true;
    await this.adminRepo.save(admin);
    return {
      access_token: this.generateAccessToken(payload),
      refreshToken,
    };
  }

  async getAdminProfile(id: number): Promise<Admin> {
    const admin = await this.adminRepo.findOne({
      where: { id: id },
    });
    if (!admin) {
      throw new BadRequestException('NOT FOUND!');
    }
    return admin;
  }

  async listBySelect(listParamsDto: ListParamsDto) {
    const queryBuilder = this.adminRepo
      .createQueryBuilder('admin')
      .select([
        'admin.id',
        'admin.createdAt',
        'admin.updatedAt',
        'admin.username',
        'admin.hasAdmin',
        'admin.refresh_token',
      ])
      .limit(listParamsDto.limit)
      .offset(listParamsDto.countOffset())
      .orderBy(listParamsDto.getOrderedField(), listParamsDto.order);

    const [data, itemsCount] = await queryBuilder.getManyAndCount();
    return new ListDto(data, {
      page: listParamsDto.page,
      itemsCount,
      limit: listParamsDto.limit,
      order: listParamsDto.order,
      orderField: listParamsDto.orderField,
    });
  }
  // ===========================================================================================
}
