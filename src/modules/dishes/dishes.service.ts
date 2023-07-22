import { BadRequestException,Injectable } from '@nestjs/common';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { BaseService } from 'src/base/base.service';
import { Dish } from './entities/dish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../category/entities/category.entity';
import { ImageService } from '../image/image.service';

@Injectable()
export class DishesService extends BaseService<Dish>{
  constructor(
    @InjectRepository(Dish)
    private readonly dishRepo: Repository<Dish>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    private readonly imageService: ImageService
  ){
    super(dishRepo)
  }

  // async createOneDish(
  //   dishDto: CreateDishDto,
  //   categoryName: string, // Add categoryName parameter to receive the category name
  //   file: Express.Multer.File,
  // ) {
  //   const dish = new Dish();

  //   if (!file) {
  //     throw new BadRequestException('Image is not provided!');
  //   }

  //   const image = await this.imageService.createImage(file);
  //   dish.absorbFromDto(dishDto);
  //   dish.image = image;

  //   // Create or get the category
  //   let category = await this.categoryService.createOne({ name: });

  //   // Associate the category with the dish
  //   dish.category = category;

  //   await this.dishRepo.save(dish);
  //   return dish;
  // }

  async createOneDish(
    dishDto: CreateDishDto,
    file: Express.Multer.File){
      const dish = new Dish()
      const category = await this.categoryRepo.findOne({
        where:{name:dishDto.category}
      })
      if(!category){
        throw new BadRequestException('Category is not provided!')
      }
      if(!file){
        throw new BadRequestException('Image is not provided!');
      }
      const image = await this.imageService.createImage(file)
      dish.absorbFromDto(dishDto)
      dish.image = image
      dish.category = category
      await this.dishRepo.save(dish)
      return dish
  }

}
