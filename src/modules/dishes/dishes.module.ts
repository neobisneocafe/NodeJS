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
import { MenuItemsModule } from '../menu-items/menu-items.module';
import { MenuItemsService } from '../menu-items/menu-items.service';
import { MenuItem } from '../menu-items/entities/menu-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Dish, Image, MenuItem]),
    CategoryModule,
    ImageModule,
    CloudinaryModule,
    MenuItemsModule,
  ],
  controllers: [DishesController],
  providers: [DishesService, MenuItemsService],
  exports: [DishesService],
})
export class DishesModule {}
