import {
  Body,
  Get,
  Controller,
  Post,
  Req,
  UseGuards,
  Patch,
  Param,
} from '@nestjs/common';
import { BasketService } from './basket.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/roles/role.guard';
import { UserRoleEnum } from '../user/enums/user.role.enum';
import { Roles } from '../auth/roles/role.decorator';
import { OrderDto } from './dto/order.dto';

@ApiTags('Корзина и заказы')
@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Roles(UserRoleEnum.USER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Вывести мою корзину заказов' })
  @Get()
  async getAllMyOrders(@Req() req) {
    return await this.basketService.getAllMyOrders(req.user.id);
  }

  @Roles(UserRoleEnum.USER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Сделать заказ' })
  @Post('order')
  async order(@Req() req, @Body() orderDto: OrderDto) {
    return await this.basketService.order(req.user.id, orderDto);
  }

  @Patch(':orderId')
  async activateOrder(@Param('orderId') orderId: number) {
    return await this.basketService.approveOrder(orderId);
  }
}
