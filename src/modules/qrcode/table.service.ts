import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TableEntity } from './entities/table.entity';
import { BaseService } from 'src/base/base.service';
import { CreateTableDto } from './dto/create_table.dto';
import * as qrcode from 'qrcode';
import { Repository } from 'typeorm';
import { BranchEntity } from '../branch/entities/branch.entity';
import { BookTableDto } from './dto/book_table.dto';
import { UserService } from '../user/user.service';
import { ReleaseTableDto } from './dto/release_table.dto';

@Injectable()
export class TableService extends BaseService<TableEntity> {
  constructor(
    @InjectRepository(TableEntity)
    private readonly tableRepo: Repository<TableEntity>,
    @InjectRepository(BranchEntity)
    private readonly branchRepo: Repository<BranchEntity>,
    private readonly userService: UserService,
  ) {
    super(tableRepo);
  }

  async createTable(data: CreateTableDto) {
    let uniqueCode = await this.generateRandomString();
    uniqueCode = await this.checkIfUnique(uniqueCode);
    await this.checkTableName(data);
    const branch = await this.branchRepo.findOne({
      where: { id: data.branchId },
      relations: ['tables'],
    });
    const table = new TableEntity();
    table.name = data.name;
    const qrCodeDataUrl = await qrcode.toDataURL(uniqueCode);
    table.qrcode = qrCodeDataUrl;
    table.uniqueCode = uniqueCode;
    branch.tables.push(table);
    await this.branchRepo.save(branch);
    return await this.tableRepo.save(table);
  }

  async bookTable(userId: number, bookTableDto: BookTableDto) {
    const { uniqueCode, branchId } = bookTableDto;
    const user = await this.userService.getProfile(userId);
    const table = await this.tableRepo.findOne({
      where: { uniqueCode: uniqueCode, branch: { id: branchId } },
      relations: ['branch'],
    });
    // console.log(user);
    await this.checkIfExcist(user);
    await this.checkIfExcist(table);
    if (user.table[0]) {
      throw new BadRequestException('У вас есть забронированный столик');
    }
    if (!user.table[0] && !table.isBooked) {
      table.isBooked = true;
      user.table.push(table);
      await this.tableRepo.save(table);
      await this.userService.save(user);
      return user;
    }
    return null;
  }

  async releaseTable(userId: number, releaseTable: ReleaseTableDto) {
    const table = await this.tableRepo.findOne({
      where: { id: releaseTable.tableId },
    });
    const user = await this.userService.getProfile(userId);
    await this.checkIfExcist(user);
    await this.checkIfExcist(table);
    if (table === user.table[0] || table.isBooked) {
      table.isBooked = false;
      user.table = [];
      await this.userService.save(user);
      await this.tableRepo.save(table);
      return user;
    }
    return user;
  }

  async getMyTable(userId: number) {
    const user = await this.userService.getProfile(userId);
    return user.table;
  }

  async listAllBranchTables(id: number) {
    const branch = await this.branchRepo.findOne({
      where: { id: id },
      relations: ['tables'],
    });
    if (!branch) {
      throw new BadRequestException('Филиала с таким id не найдено');
    }
    return branch.tables;
  }

  private async checkIfExcist(obj: any) {
    if (!obj) {
      throw new BadRequestException(`Объект ${obj} не найден`);
    }
  }

  private async generateRandomString() {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < 20; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  }

  private async checkIfUnique(uniqueCode: string) {
    const ifNumberNotUnique = await this.tableRepo.findOne({
      where: { uniqueCode: uniqueCode },
    });
    if (ifNumberNotUnique) {
      uniqueCode = await this.generateRandomString();
      await this.checkIfUnique(uniqueCode);
    }
    return uniqueCode;
  }

  private async checkTableName(data: CreateTableDto) {
    const branch = await this.branchRepo.findOne({
      where: { id: data.branchId },
      relations: ['tables'],
    });
    if (!branch) {
      throw new BadRequestException('Филиала с таким id не найдено');
    }
    for (let i = 0; i < branch.tables.length; i++) {
      if (branch.tables[i].name === data.name) {
        throw new BadRequestException(
          'Столик с таким названием уже есть в этом филиале',
        );
      }
    }
  }
}
