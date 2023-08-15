import { Controller, Get, Post, Body, Query,Param } from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListParamsDto } from 'src/base/dto/list-params.dto';
import { ApiBody, ApiConsumes} from '@nestjs/swagger';
import { ItemsEnum } from './enum/enum';
@ApiTags('Ингредиенты')
@Controller('menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Post('/post/new')
  @ApiOperation({ summary: 'Создание нового ингредиента' })
  create(@Body() createMenuItemDto: CreateMenuItemDto) {
    return this.menuItemsService.createOne(createMenuItemDto);
  }

  @Get('list')
  @ApiOperation({ summary: 'Получить список всех ингредиентов' })
  getList(@Query() lispParamsDto: ListParamsDto) {
    return this.menuItemsService.list(lispParamsDto);
  }

  @Get('/sorted/by/type')
  @ApiOperation({
    summary: 'Получить сортированный по типу ингредиенты',
  })
  async findUsersByStatus(
    @Query() listParamsDto: ListParamsDto,
    @Query('type') type: ItemsEnum,
  ) {
    return await this.menuItemsService.listByENum(listParamsDto,type)
  }

  @Get('get/types')
  @ApiOperation({summary:'Получить список типов для ингредиентов'})
  async getTypes(){
    return await this.menuItemsService.getTypesOfMenuItems()
  }

}
