import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BaristaService } from './barista.service';
import { CreateBaristaDto } from './dto/create-barista.dto';
import { UpdateBaristaDto } from './dto/update-barista.dto';
import { AuthService } from '../auth/auth.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListParamsDto } from 'src/base/dto/list-params.dto';

@ApiTags('Бариста')
@Controller('barista')
export class BaristaController {
  constructor(
    private readonly baristaService: BaristaService,
    private readonly authservice: AuthService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Создать баристу' })
  create(@Body() createBaristaDto: CreateBaristaDto) {
    return this.baristaService.createOneBarista(createBaristaDto);
  }

  @Post('/send/logincode')
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
  async sendCode(@Body('phoneNumber') phoneNumber: string) {
    return await this.baristaService.sendVerifyCodeToBarista(phoneNumber);
  }

  @Post('logincode')
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
  @ApiOperation({ summary: 'Подтвердить код отправленный на номер телефона' })
  async verify(@Body('verificationCode') verificationCode: string) {
    return await this.baristaService.berifyCodeToBarista(verificationCode);
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
    const token = await this.baristaService.refreshAccessToken(refresh_token);
    return token;
  }

  @Get('list')
  @ApiOperation({ summary: 'Получить список всех барист' })
  async getlist(@Query() ListParamsDto: ListParamsDto) {
    return await this.baristaService.list(ListParamsDto);
  }
}
