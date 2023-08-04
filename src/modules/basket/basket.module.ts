import { Module } from '@nestjs/common';
import { BasketController } from './basket.controller';
import { BasketService } from './basket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Basket } from './entities/basket.entity';
import { UserModule } from '../user/user.module';
import { DishesModule } from '../dishes/dishes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Basket]), UserModule, DishesModule],
  controllers: [BasketController],
  providers: [BasketService],
})
export class BasketModule {}
