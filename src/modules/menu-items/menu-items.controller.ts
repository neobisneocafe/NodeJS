import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListParamsDto } from 'src/base/dto/list-params.dto';

@ApiTags('Ингредиенты')
@Controller('menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Post('/post/new')
  @ApiOperation({ summary: 'Создание нового ингредиента' })
  create(@Body() createMenuItemDto: CreateMenuItemDto) {
    return this.menuItemsService.createOne(createMenuItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список всех ингредиентов' })
  getList(@Query() lispParamsDto: ListParamsDto) {
    return this.menuItemsService.list(lispParamsDto);
  }
}
