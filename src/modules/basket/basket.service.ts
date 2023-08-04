import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Basket } from './entities/basket.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/base/base.service';
import { OrderDto } from './dto/order.dto';
import { UserService } from '../user/user.service';
import { DishesService } from '../dishes/dishes.service';

@Injectable()
export class BasketService extends BaseService<Basket> {
  constructor(
    @InjectRepository(Basket)
    private readonly basketRepo: Repository<Basket>,
    private readonly userService: UserService,
    private readonly dishesService: DishesService,
  ) {
    super(basketRepo);
  }

  async order(userId: number, data: OrderDto) {
    const dishId = data.dishId;
    const dishesList = [];
    for (let i = 0; i < dishId.length; i++) {
      const dish = await this.dishesService.getOneDish(dishId[i]);
      await this.checkIfExcist(dish, 'dish', dish.id);
      dishesList.push(dish);
    }
    const user = await this.userService.getProfile(userId);
    await this.checkIfExcist(user, 'user', user.id);
    const newOrder = new Basket();
    let dishesPrice = 0;
    for (let i = 0; i < dishesList.length; i++) {
      dishesPrice += dishesList[i].price;
    }
    const serviceCost = dishesPrice / 10;
    newOrder.dishesPrice = dishesPrice;
    newOrder.serviceCost = serviceCost;
    newOrder.overall = dishesPrice + serviceCost;
    newOrder.dishes = dishesList;
    newOrder.user = user;
    return await this.basketRepo.save(newOrder);
  }

  async getAllMyOrders(userId: number) {
    const orders = await this.basketRepo.find({
      where: { user: { id: userId } },
      relations: ['dishes'],
    });
    return orders;
  }

  async approveOrder(orderId: number) {
    const order = await this.basketRepo.findOne({ where: { id: orderId } });
    order.isApproved = true;
    order.isPaid = true;
    return await this.basketRepo.save(order);
  }
}
