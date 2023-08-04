import { Module } from '@nestjs/common';
import { DishesService } from './dishes.service';
import { DishesController } from './dishes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../category/entities/category.entity';
import { Dish } from './entities/dish.entity';
import { CategoryModule } from '../category/category.module';
import { ImageModule } from '../image/image.module';
import { CloudinaryModule } from 'src/services/cloudinary/cloudinary.modules';
import { Image } from '../image/entities/image.entity';
import { CategoryService } from '../category/category.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Dish, Image]),
    CategoryModule,
    ImageModule,
    CloudinaryModule,
  ],
  controllers: [DishesController],
  providers: [DishesService],
  exports: [DishesService],
})
export class DishesModule {}
