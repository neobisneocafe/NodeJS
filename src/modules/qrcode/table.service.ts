import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TableEntity } from './entities/table.entity';
import { BaseService } from 'src/base/base.service';
import { CreateTableDto } from './dto/create_table.dto';
import * as qrcode from 'qrcode';
import { Repository } from 'typeorm';

@Injectable()
export class TableService extends BaseService<TableEntity> {
  constructor(
    @InjectRepository(TableEntity)
    private readonly tableRepo: Repository<TableEntity>,
  ) {
    super(tableRepo);
  }

  async createTable(data: CreateTableDto) {
    let uniqueCode = await this.generateRandomString();
    uniqueCode = await this.checkIfUnique(uniqueCode);
    const ifExcists = await this.tableRepo.findOne({
      where: { name: data.name },
    });
    if (ifExcists) {
      throw new BadRequestException('Столик с таким названием уже есть');
    }
    const table = new TableEntity();
    table.name = data.name;
    const qrCodeDataUrl = await qrcode.toDataURL(uniqueCode);
    table.qrcode = qrCodeDataUrl;
    table.uniqueCode = uniqueCode;
    return await this.tableRepo.save(table);
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
}
