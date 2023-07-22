import { Injectable, BadRequestException,  } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { BaseService } from 'src/base/base.service';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService extends BaseService<Category>{
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>
  ){
    super(categoryRepo)
  }

  async createOne(cateoryDto: CreateCategoryDto){
    const isExist = await this.categoryRepo.findOne({
      where:{name:cateoryDto.name}
    })
    if(isExist){
      throw new BadRequestException('Category is already exists')
    }
    const newCategory = this.categoryRepo.create(cateoryDto);
    return await this.categoryRepo.save(newCategory); 
  }
}
