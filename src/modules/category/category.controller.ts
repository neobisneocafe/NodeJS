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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListParamsDto } from 'src/base/dto/list-params.dto';

@ApiTags('Категории')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/create')
  @ApiOperation({ summary: ' Create new category ' })
  async creaateCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.createOne(createCategoryDto);
  }

  @Get('/list')
  @ApiOperation({summary:'Получить список всех категорий'})
  async getList(@Query() listParamsDto:ListParamsDto){
    return await this.categoryService.list(listParamsDto)
  }

  @Get('list/category/name')
  @ApiOperation({summary:'Получить список блюд определенной категории'})
  async getLisOfDishesByCategory(@Param('name') name:string){
    return await this.categoryService.getDishesOfCategory(name)
  }


}
