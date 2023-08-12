import { Module } from '@nestjs/common';
import { BaristaService } from './barista.service';
import { BaristaController } from './barista.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Barista } from './entities/barista.entity';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { jwtConstants } from '../auth/constants/auth-constants';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfirmCode } from '../auth/entities/auth.entity';
import { SmsNikitaModule } from 'src/services/sms-nikita.ts/sms-nikita.module';
import { Admin } from '../auth/entities/admins.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, Barista, User, ConfirmCode]),
    SmsNikitaModule,
    AuthModule,
    UserModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [BaristaController],
  providers: [BaristaService, AuthService, JwtStrategy],
})
export class BaristaModule {}
