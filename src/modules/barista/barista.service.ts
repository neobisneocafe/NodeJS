import { BadRequestException, Injectable, UnauthorizedException,} from '@nestjs/common';
import { CreateBaristaDto } from './dto/create-barista.dto';
import { UpdateBaristaDto } from './dto/update-barista.dto';
import { BaseService } from 'src/base/base.service';
import { Barista } from './entities/barista.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken'

@Injectable()
export class BaristaService extends BaseService<Barista> {
  constructor(
    @InjectRepository(Barista)
    private readonly baristaRepo: Repository<Barista>,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {
    super(baristaRepo);
  }
  
  async createOneBarista(dto: CreateBaristaDto) {
    const barista = new Barista();
    barista.absorbFromDto(dto);
    barista.confirm = true;
    await this.baristaRepo.save(barista);
    return barista;
  }

  async sendVerifyCodeToBarista(phoneNumber: string) {
    const barista = await this.baristaRepo.findOneBy({ phoneNumber });
    if (!barista) {
      throw new BadRequestException('Бариста не найден!');
    }
    const loginCode = await this.authService.sendConfirmationCode(phoneNumber);
    barista.login_code = loginCode;
    await this.baristaRepo.save(barista);
    return `Полученный код подтверждения ${loginCode}`;
  }

  async berifyCodeToBarista(login_code: string) {
    const barista = await this.baristaRepo.findOneBy({ login_code });
    if (!barista)
      throw new BadRequestException('Неправильный код подтверждения');
    await this.refreshVerifyCodeForBarista(barista.phoneNumber);

    const payload = {
      id: barista.id,
      firstName: barista.firstName,
      lastName: barista.lastName,
      phoneNumber: barista.phoneNumber,
      role: barista.role,
    };

    const refreshToken = await this.authService.generateRefreshToken();
    barista.refresh_token = refreshToken;
    return {
      access_token: await this.jwtService.sign(payload),
      refreshToken,
    };
  }

  async refreshVerifyCodeForBarista(phoneNumber: string) {
    const barista = await this.baristaRepo.findOneBy({ phoneNumber });

    if (!barista) {
      throw new BadRequestException('Бариста не найден!');
    }
    if (barista.login_code) {
      barista.login_code = null;
      await this.baristaRepo.save(barista);
    }
    const newLoginCode = await this.authService.sendConfirmationCode(
      phoneNumber,
    );
    barista.login_code = newLoginCode;
    await this.baristaRepo.save(barista);

    return `Полученный новый код подтверждения ${newLoginCode}`;
  }

  async refreshAccessToken(refresh_token:string){
    const barista = await this.baristaRepo.findOne({
      where:{refresh_token:refresh_token}
    })
    if(!barista)throw new UnauthorizedException()
    const payload = {
      id: barista.id,
      firstName: barista.firstName,
      lastName: barista.lastName,
      phoneNumber: barista.phoneNumber,
      role: barista.role,
    };
    return {
      access_token: await this.jwtService.sign(payload)
    }
  }

}
