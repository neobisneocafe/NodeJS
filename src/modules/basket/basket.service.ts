import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Basket } from './entities/basket.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/base/base.service';
import { OrderDto } from './dto/order.dto';
import { UserService } from '../user/user.service';
import { DishesService } from '../dishes/dishes.service';
import { BranchService } from '../branch/branch.service';

@Injectable()
export class BasketService extends BaseService<Basket> {
  constructor(
    @InjectRepository(Basket)
    private readonly basketRepo: Repository<Basket>,
    private readonly userService: UserService,
    private readonly dishesService: DishesService,
    private readonly branchService: BranchService,
  ) {
    super(basketRepo);
  }

  async getOrder(id: number) {
    const order = await this.basketRepo.findOne({
      where: { id: id },
      relations: ['dishes', 'dishes.image', 'branch'],
    });
    await this.checkIfExcist(order, 'order', id);
    return order;
  }

  async order(userId: number, data: OrderDto, branchId: number) {
    const dishId = data.dishId;
    const dishesList = [];
    for (let i = 0; i < dishId.length; i++) {
      const dish = await this.dishesService.getOneDish(dishId[i]);
      await this.checkIfExcist(dish, 'dish', dishId[i]);
      dishesList.push(dish);
    }
    const branch = await this.branchService.get(branchId);
    await this.checkIfExcist(branch, 'branch', branchId);
    const user = await this.userService.getProfile(userId);
    await this.checkIfExcist(user, 'user', userId);
    const newOrder = new Basket();
    let dishesPrice = 0;
    for (let i = 0; i < dishesList.length; i++) {
      dishesPrice += dishesList[i].price;
    }
    const serviceCost = dishesPrice / 10;
    newOrder.branch = branch;
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
      relations: ['dishes', 'branch', 'dishes.image'],
    });
    return orders;
  }

  async listOrders() {
    const orders = await this.basketRepo.find({
      relations: ['user', 'dishes', 'branch', 'dishes.image'],
    });
    return this.filterOrders(orders);
  }
  async listOrdersByBranch(branchId: number) {
    const branch = await this.branchService.getOne(branchId);
    await this.checkIfExcist(branch, 'branch', branchId);
    const orders = await this.basketRepo.find({
      where: { branch: { id: branchId } },
      relations: ['user', 'dishes', 'branch', 'dishes.image'],
    });
    return this.filterOrders(orders);
  }

  async filterOrders(orders: Basket[]) {
    for (let i = 0; i < orders.length; i++) {
      await this.deleteKeys(orders[i], [
        'id',
        'isApproved',
        'IsPaid',
        'IsCompleted',
        'dishesPrice',
        'serviceCost',
        'overall',
        'user',
        'branch',
        'dishes',
      ]);
      await this.deleteKeys(orders[i].user, [
        'firstName',
        'phoneNumber',
        'role',
      ]);
      await this.deleteKeys(orders[i].branch, ['id', 'name', 'adress']);
      for (let j = 0; j < orders[i].dishes.length; j++) {
        await this.deleteKeys(orders[i].dishes[j], [
          'id',
          'name',
          'image',
          'category',
          'menuItem',
        ]);
        await this.deleteKeys(orders[i].dishes[j].image, ['url']);
      }
    }
    return orders;
  }

  async deleteKeys(obj, except) {
    Object.keys(obj).forEach((n) => except.includes(n) || delete obj[n]);
  }
  async repeat(userId: number, orderId: number, branchId: number) {
    const user = await this.userService.getProfile(userId);
    const order = await this.get(orderId);
    const branch = await this.branchService.get(branchId);
    await this.checkIfExcist(order, 'order', orderId);
    await this.checkIfExcist(user, 'user', userId);
    await this.checkIfExcist(branch, 'branch', branchId);
    const newOrder = new Basket();
    Object.assign(newOrder, order);
    delete newOrder.id;
    newOrder.branch = branch;
    newOrder.isApproved = false;
    newOrder.isPaid = false;
    newOrder.isCompleted = false;
    newOrder.user = user;
    return await this.basketRepo.save(newOrder);
  }

  async approveOrder(orderId: number) {
    const order = await this.basketRepo.findOne({ where: { id: orderId } });
    order.isApproved = true;
    order.isPaid = true;
    order.isCompleted = true;
    return await this.basketRepo.save(order);
  }

  async deleteOrder(id: number) {
    const order = await this.basketRepo.findOne({ where: { id: id } });
    await this.checkIfExcist(order, 'order', id);
    return await this.basketRepo.remove(order);
  }
}
