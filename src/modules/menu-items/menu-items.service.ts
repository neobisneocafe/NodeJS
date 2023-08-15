import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { BaseService } from 'src/base/base.service';
import { MenuItem } from './entities/menu-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from '../image/entities/image.entity';
import { ImageService } from '../image/image.service';
import { ListParamsDto } from 'src/base/dto/list-params.dto';
import { ItemsEnum } from './enum/enum';
import { ListDto } from 'src/base/dto/list.dto';

@Injectable()
export class MenuItemsService extends BaseService<MenuItem> {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepo: Repository<MenuItem>,
    @InjectRepository(Image)
    private readonly imageRepo: Repository<Image>,
    private readonly imageService: ImageService,
  ) {
    super(menuItemRepo);
  }

  async createOne(dto: CreateMenuItemDto) {
    const newItem = new MenuItem();
    const isExistItem = await this.menuItemRepo.findOne({
      where: { name: dto.name },
    });
    if (isExistItem) {
      throw new BadRequestException('MENU ITEM IS ALREADY EXIST!');
    }
    newItem.absorbFromDto(dto);
    await this.menuItemRepo.save(newItem);
    return newItem;
  }

  async createOneItem(dto: CreateMenuItemDto, file: Express.Multer.File) {
    const newItem = new MenuItem();
    const isExistItem = await this.menuItemRepo.findOne({
      where: { name: dto.name },
    });
    if (isExistItem) {
      throw new BadRequestException('MENU ITEM IS ALREADY EXIST!');
    }
    if (!file) {
      throw new BadRequestException('FILE IS NOT PROVIDED');
    }
    const image = await this.imageService.createImage(file);
    newItem.absorbFromDto(dto);
    newItem.image = image;
    await this.menuItemRepo.save(newItem);
    return newItem;
  }

  async listByENum(listParamsDto: ListParamsDto, type: ItemsEnum){
    const array = await this.repository
    .createQueryBuilder('menu_items')
    .where('menu_items.type = :type',{type})
    .limit(listParamsDto.limit)
    .offset(listParamsDto.countOffset())
    .orderBy(`menu_items.${listParamsDto.getOrderedField()}`, listParamsDto.order)
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

  async getTypesOfMenuItems(){
    return ItemsEnum
  }
}
