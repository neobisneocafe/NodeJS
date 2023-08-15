import {
  Body,
  Delete,
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

@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @ApiTags('Корзина и заказы для пользователя')
  @Roles(UserRoleEnum.USER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Вывести мою корзину заказов' })
  @Get()
  async getAllMyOrders(@Req() req) {
    return await this.basketService.getAllMyOrders(req.user.id);
  }

  @ApiTags('Корзина и заказы для пользователя')
  @ApiOperation({ summary: 'Найти заказ по id' })
  @Get(':orderId')
  async getOneOrder(@Param('orderId') orderId: number) {
    return await this.basketService.getOrder(orderId);
  }

  @ApiTags('Корзина и заказы для пользователя')
  @Roles(UserRoleEnum.USER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Сделать заказ' })
  @Post(':branchId/order')
  async order(
    @Param('branchId') branchId: number,
    @Req() req,
    @Body() orderDto: OrderDto,
  ) {
    return await this.basketService.order(req.user.id, orderDto, +branchId);
  }

  @ApiTags('Корзина и заказы для пользователя')
  @Roles(UserRoleEnum.USER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Повторить заказ' })
  @Post(':branchId/:orderId/:uniqueCode')
  async repeatOrder(
    @Param('branchId') branchId: number,
    @Param('orderId') orderId: number,
    @Param('uniqueCode') uniqueCode: string,
    @Req() req,
  ) {
    return await this.basketService.repeat(
      req.user.id,
      +orderId,
      +branchId,
      uniqueCode,
    );
  }

  @ApiTags('Корзина и заказы для админа или баристы')
  @ApiOperation({ summary: 'Вывести список всех заказов' })
  @Get('all')
  async getAllOrder() {
    return await this.basketService.listOrders();
  }

  @ApiTags('Корзина и заказы для админа или баристы')
  @ApiOperation({
    summary: 'Вывести список всех заказов определенного филиала',
  })
  @Get('byBranch/:branchId')
  async getBranchOrders(@Param('branchId') branchId: number) {
    return await this.basketService.listOrdersByBranch(branchId);
  }

  @ApiTags('Корзина и заказы для админа или баристы')
  @ApiOperation({ summary: 'Подтвердить и завершить заказ' })
  @Patch(':orderId')
  async activateOrder(@Param('orderId') orderId: number) {
    return await this.basketService.approveOrder(orderId);
  }

  @ApiTags('Корзина и заказы для админа или баристы')
  @ApiOperation({ summary: 'Удалить заказ' })
  @Delete(':orderId')
  async deleteOrder(@Param('orderId') orderId: number) {
    return await this.basketService.deleteOrder(orderId);
  }
}
