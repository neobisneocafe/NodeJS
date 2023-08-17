import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Basket } from './entities/basket.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/base/base.service';
import { OrderDto } from './dto/order.dto';
import { UserService } from '../user/user.service';
import { DishesService } from '../dishes/dishes.service';
import { BranchService } from '../branch/branch.service';
import { TableService } from '../qrcode/table.service';
import { BookTableDto } from '../qrcode/dto/book_table.dto';
import { ReleaseTableDto } from '../qrcode/dto/release_table.dto';

@Injectable()
export class BasketService extends BaseService<Basket> {
  constructor(
    @InjectRepository(Basket)
    private readonly basketRepo: Repository<Basket>,
    private readonly userService: UserService,
    private readonly dishesService: DishesService,
    private readonly branchService: BranchService,
    private readonly tableService: TableService,
  ) {
    super(basketRepo);
  }

  async getOrder(id: number) {
    const order = await this.basketRepo.findOne({
      where: { id: id },
      relations: [
        'dishes',
        'dishes.image',
        'branch',
        'dishes.category',
        'user',
        'user.table',
      ],
    });
    await this.checkIfExcist(order, 'order', id);
    return order;
  }

  async order(userId: number, data: OrderDto, branchId: number) {
    const branch = await this.branchService.get(branchId);
    await this.checkIfExcist(branch, 'branch', branchId);
    const user = await this.userService.getProfile(userId);
    if (user.bonusPoints < data.bonusPoints) {
      throw new BadRequestException(
        'У вас недостаточно бонусов для списывания',
      );
    }
    await this.checkIfExcist(user, 'user', userId);
    const bookTableDto = new BookTableDto();
    bookTableDto.branchId = branchId;
    bookTableDto.uniqueCode = data.uniqueCode;
    const dishId = data.dishId;
    const dishesList = [];
    for (let i = 0; i < dishId.length; i++) {
      const dish = await this.dishesService.getOneDish(dishId[i]);
      await this.checkIfExcist(dish, 'dish', dishId[i]);
      dishesList.push(dish);
    }

    const newOrder = new Basket();
    let dishesPrice = 0;
    for (let i = 0; i < dishesList.length; i++) {
      dishesPrice += dishesList[i].price;
    }
    if (data.bonusPoints > dishesPrice) {
      data.bonusPoints = dishesPrice;
    }
    newOrder.branch = branch;
    newOrder.dishesPrice = dishesPrice;
    newOrder.bonusPoints = data.bonusPoints;
    newOrder.overall = dishesPrice - data.bonusPoints;
    user.bonusPoints -= data.bonusPoints;
    newOrder.dishes = dishesList;
    newOrder.user = user;
    await this.userService.save(user);
    if (bookTableDto.uniqueCode) {
      await this.tableService.bookTable(userId, bookTableDto);
    }
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
    return await this.filterOrders(orders);
  }
  async listOrdersByBranch(branchId: number) {
    const branch = await this.branchService.getOne(branchId);
    await this.checkIfExcist(branch, 'branch', branchId);
    const orders = await this.basketRepo.find({
      where: { branch: { id: branchId } },
      relations: ['user', 'dishes', 'branch', 'dishes.image'],
    });
    return await this.filterOrders(orders);
  }

  private async filterOrders(orders: Basket[]) {
    for (let i = 0; i < orders.length; i++) {
      await this.filterKeys(orders[i], [
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
      await this.filterKeys(orders[i].user, [
        'firstName',
        'phoneNumber',
        'role',
      ]);
      await this.filterKeys(orders[i].branch, ['id', 'name', 'adress']);
      for (let j = 0; j < orders[i].dishes.length; j++) {
        await this.filterKeys(orders[i].dishes[j], [
          'id',
          'name',
          'image',
          'category',
          'menuItem',
        ]);
        await this.filterKeys(orders[i].dishes[j].image, ['url']);
      }
    }
    return orders;
  }

  async repeat(
    userId: number,
    orderId: number,
    branchId: number,
    uniqueCode: string,
  ) {
    const user = await this.userService.getProfile(userId);
    const booltableDto = new BookTableDto();
    booltableDto.branchId = branchId;
    booltableDto.uniqueCode = uniqueCode;
    await this.tableService.bookTable(userId, booltableDto);
    const order = await this.basketRepo.findOne({
      where: { id: orderId },
      relations: ['dishes', 'dishes.image', 'branch', 'dishes.category'],
    });
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
    const order = await this.basketRepo.findOne({
      where: { id: orderId },
      relations: ['user', 'user.table', 'branch'],
    });
    await this.checkIfExcist(order, 'order', orderId);
    const releaseTableDto = new ReleaseTableDto();
    if (order.user.table[0]) {
      releaseTableDto.branchId = order.branch.id;
      releaseTableDto.tableId = order.user.table[0].id;
      await this.tableService.releaseTable(releaseTableDto);
    }
    order.isApproved = true;
    order.isPaid = true;
    order.isCompleted = true;
    return await this.basketRepo.save(order);
  }

  async deleteOrder(id: number) {
    const order = await this.basketRepo.findOne({
      where: { id: id },
      relations: ['user', 'user.table', 'branch'],
    });
    await this.checkIfExcist(order, 'order', id);
    const releaseTableDto = new ReleaseTableDto();
    if (order.user.table[0]) {
      releaseTableDto.branchId = order.branch.id;
      releaseTableDto.tableId = order.user.table[0].id;
      await this.tableService.releaseTable(releaseTableDto);
    }
    return await this.basketRepo.remove(order);
  }
}
