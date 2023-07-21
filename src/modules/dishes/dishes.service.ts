import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { BaseService } from 'src/base/base.service';
import { Dish } from './entities/dish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../category/entities/category.entity';
import { ImageService } from '../image/image.service';
import { ListParamsDto } from 'src/base/dto/list-params.dto';
import { ListDto } from 'src/base/dto/list.dto';

@Injectable()
export class DishesService extends BaseService<Dish> {
  constructor(
    @InjectRepository(Dish)
    private readonly dishRepo: Repository<Dish>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    private readonly imageService: ImageService,
  ) {
    super(dishRepo);
  }

  async createOneDish(dishDto: CreateDishDto, file: Express.Multer.File) {
    const dish = new Dish();
    const category = await this.categoryRepo.findOne({
      where: { name: dishDto.category },
    });
    if (!category) {
      throw new BadRequestException('Category is not provided!');
    }
    if (!file) {
      throw new BadRequestException('Image is not provided!');
    }
    const image = await this.imageService.createImage(file);
    dish.absorbFromDto(dishDto);
    dish.image = image;
    dish.category = category;
    await this.dishRepo.save(dish);
    return dish;
  }

  async findOneDish(id: number) {
    return await this.dishRepo.findOne({
      where:{id},
      relations:['category','image']
    })
  }

  async listsDishes(listParamsDTo:ListParamsDto){
    const array = await this.dishRepo.createQueryBuilder('dish')
    .leftJoinAndSelect('dish.image','image')
    .leftJoinAndSelect('dish.category','category')
    .where('dish.isDeleted != true')
    .limit(listParamsDTo.limit)
    .offset(listParamsDTo.countOffset())
    .orderBy(`
    dish.${listParamsDTo.getOrderedField()}`,listParamsDTo.order)
    .getMany()
    const itemsCount = await this.repository.createQueryBuilder().getCount()
    return new ListDto(array,{
      page:listParamsDTo.page,
      itemsCount,
      limit:listParamsDTo.limit,
      order:listParamsDTo.order,
      orderField:listParamsDTo.orderField
    })
  }
}
