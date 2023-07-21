import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfirmAccountDto } from './dto/confirm-account.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';

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

  // @Post('confirm')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       codeToConfirm: {
  //         type: 'string',
  //       },
  //     },
  //   },
  // })
  // async confirm(@Body('codeToConfirm') codeToConfirm: string) {
  //   return await this.authService.confirmAccount(codeToConfirm);
  // }

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
    const token = await this.authService.refreshAccessToken(refresh_token);
    return token;
  }
}
