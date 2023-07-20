import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfirmAccountDto } from './dto/confirm-account.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginAdminDto } from './dto/admin.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ListParamsDto } from 'src/base/dto/list-params.dto';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Post('confirm')
  @ApiOperation({ summary: 'Активировать аккаунт' })
  async confirm(@Body() confirmAccountDto: ConfirmAccountDto) {
    return this.authService.confirm(confirmAccountDto);
  }

  @Post('login/send-verification-code')
  @ApiOperation({ summary: 'Отправить код на номер телефона' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phoneNumber: {
          type: 'string',
        },
      },
    },
  })
  async sendVerificationCode(
    @Body('phoneNumber') phoneNumber: string,
  ): Promise<void> {
    await this.authService.sendVerifyCode(phoneNumber);
  }

  @Post('login/verify')
  @ApiOperation({ summary: 'Подтвердить код отправленный на номер телефона' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        verificationCode: {
          type: 'string',
        },
      },
    },
  })
  async verifyCode(
    @Body('verificationCode') verificationCode: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const result = await this.authService.verifyCode(verificationCode);
    return result;
  }

  @Post('/refresh')
  @ApiOperation({ summary: 'Обновить access токен' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refresh_token: {
          type: 'string',
        },
      },
    },
  })
  async refreshToken(@Body('refresh_token') refresh_token: string) {
    const token = await this.authService.refreshAccessTokens(refresh_token);
    return token;
  }

  @ApiTags()
  @Post('/login/admin')
  @ApiOperation({ summary: 'Вход для администратор' })
  async loginAdmin(@Body() logindto: LoginAdminDto) {
    let admin = await this.authService.findAdminByUsername(logindto.username);
    if (!admin) {
      admin = await this.authService.create(logindto);
    }
    return await this.authService.login(logindto);
  }

  @Get('admin/profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить профиль администратора' })
  @UseGuards(JwtAuthGuard)
  async getAdminData(@Req() req) {
    return this.authService.getAdminProfile(req?.admin?.id);
  }

  @Get('list/admins')
  @ApiOperation({ summary: 'Получить список администраторов' })
  async getList(@Query() listParamsdto: ListParamsDto) {
    return await this.authService.listBySelect(listParamsdto);
  }
}
