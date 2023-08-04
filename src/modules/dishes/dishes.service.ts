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
    dish.price = parseInt(dishDto.price);
    dish.image = image;
    dish.category = category;
    await this.dishRepo.save(dish);
    return dish;
  }

  async getOneDish(id: number) {
    return await this.dishRepo.findOne({ where: { id: id } });
  }

  async getLlistOfDishes(listParamsDto: ListParamsDto) {
    const array = await this.dishRepo
      .createQueryBuilder('dish')
      .leftJoinAndSelect('dish.image', 'image')
      .leftJoinAndSelect('dish.category', 'category')
      // .where('dish.isDeleted!=true')
      .limit(listParamsDto.limit)
      .offset(listParamsDto.countOffset())
      .orderBy(
        `
    dish.${listParamsDto.getOrderedField()}`,
        listParamsDto.order,
      )
      .getMany();
    const itemsCount = await this.repository.createQueryBuilder().getCount();
    return new ListDto(array, {
      page: listParamsDto.page,
      itemsCount,
      limit: listParamsDto.limit,
      order: listParamsDto.order,
      orderField: listParamsDto.orderField,
    });
  }

  async getProductsSortedByCategory(name: string): Promise<Dish[]> {
    return this.dishRepo
      .createQueryBuilder('dish')
      .innerJoinAndSelect('dish.category', 'category')
      .where('category.name = :name', { name })
      .orderBy('category.name', 'ASC')
      .getMany();
  }
}
