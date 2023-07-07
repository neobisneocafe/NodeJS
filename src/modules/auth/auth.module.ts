import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/auth-constants';
import { LocalStrategy } from './strategies/local.startegy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfirmCode } from './entities/auth.entity';
import { SmsNikitaModule } from '../../services/sms-nikita.ts/sms-nikita.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ConfirmCode]),
    UserModule,
    PassportModule,
    SmsNikitaModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
