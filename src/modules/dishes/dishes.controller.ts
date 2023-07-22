import { Controller, Get, Post, Body, Patch, Param, Delete ,Query,  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,} from '@nestjs/common';
import { DishesService } from './dishes.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListParamsDto } from 'src/base/dto/list-params.dto';

@ApiTags('Блюда')
@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @Post('/post')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema:{
      type:'object',
      properties: {
        name:{
          type:'string',
          example:'Брауни',
          description:'Название блюда'
        },
        description:{
          type: 'string',
          example:'Бра́уни — шоколадное пирожное коричневого цвета, прямоугольные куски нарезанного шоколадного пирога.',
          description:'Описание блюда'
        },
        price:{
          type:'string',
          example:'140 с',
          description:'Цена блюда'
        },
        image:{
          type: 'string',
          format: 'binary',
        },
        category: { 
          type: 'string', 
          example: 'Дессерты' ,
        description: 'Название категории'},
      }
    }
  })
  create(
    @Body() createDishDto: CreateDishDto,
    @UploadedFile() file: Express.Multer.File) {
    return this.dishesService.createOneDish(createDishDto,file)
  }

  @Get('/list')
  @ApiOperation({summary:'Получить список всех блюд'})
  async listOfDishes(@Query() listParamsDto: ListParamsDto){
    return await this.dishesService.list(listParamsDto)
  }
}
