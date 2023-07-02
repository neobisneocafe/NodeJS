import { Controller, Post, Body } from '@nestjs/common';
import { TableService } from './table.service';
import { CreateTableDto } from './dto/create_table.dto';

@Controller('table')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Post()
  async createTable(@Body() data: CreateTableDto) {
    return await this.tableService.createTable(data);
  }
}
