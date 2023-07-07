import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TableEntity } from './entities/table.entity';
import { BaseService } from 'src/base/base.service';
import { CreateTableDto } from './dto/create_table.dto';
import * as qrcode from 'qrcode';
import { Repository } from 'typeorm';
import { BranchEntity } from '../branch/entities/branch.entity';
import { BookTableDto } from './dto/book_table.dto';

@Injectable()
export class TableService extends BaseService<TableEntity> {
  constructor(
    @InjectRepository(TableEntity)
    private readonly tableRepo: Repository<TableEntity>,
    @InjectRepository(BranchEntity)
    private readonly branchRepo: Repository<BranchEntity>,
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

  async bookOne(bookTableDto: BookTableDto) {
    const { branchId, uniqueCode } = bookTableDto;
    const table = await this.tableRepo.findOne({
      where: { uniqueCode: uniqueCode },
      relations: ['branch'],
    });
    const branch = await this.branchRepo.findOne({
      where: { id: branchId },
      relations: ['tables'],
    });
    if (!table) {
      throw new BadRequestException('Столик не найден');
    }
    if (!branch) {
      throw new BadRequestException('Филиала с таким id нет');
    }
    if (table.branch.id != branch.id) {
      throw new BadRequestException('Такого столика нет в это филиале');
    }
    return 'Столик забронирован';
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
    const ifExcists = await this.tableRepo.find({
      where: { name: data.name },
      relations: ['branch'],
    });
    for (let i = 0; i < branch.tables.length; i++) {
      if (branch.tables[i].name === data.name) {
        throw new BadRequestException(
          'Столик с таким названием уже есть в этом филиале',
        );
      }
    }
  }
}
