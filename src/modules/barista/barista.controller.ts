import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BaristaService } from './barista.service';
import { CreateBaristaDto } from './dto/create-barista.dto';
import { UpdateBaristaDto } from './dto/update-barista.dto';
import { AuthService } from '../auth/auth.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Бариста')
@Controller('barista')
export class BaristaController {
  constructor(
    private readonly baristaService: BaristaService,
    private readonly authservice: AuthService,
  ) {}

  @Post()
  create(@Body() createBaristaDto: CreateBaristaDto) {
    return this.baristaService.createOneBarista(createBaristaDto);
  }

  @Post('/send/code')
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
  async verify(@Body('verificationCode') verificationCode: string) {
    return await this.baristaService.berifyCodeToBarista(verificationCode);
  }
}
