import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { TableService } from './table.service';
import { CreateTableDto } from './dto/create_table.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BookTableDto } from './dto/book_table.dto';

@ApiTags('Столики с QR кодом')
@Controller('table')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @ApiOperation({ summary: 'Вывести все столики одного филиала' })
  @Get(':id')
  async getAllTables(@Param('id') id: number) {
    return await this.tableService.listAllBranchTables(id);
  }

  @ApiOperation({ summary: 'Забронировать столик' })
  @Post()
  async bookTable(@Body() bookTableDto: BookTableDto) {
    return await this.tableService.bookOne(bookTableDto);
  }
  @ApiOperation({ summary: 'Создать столик с QR кодом' })
  @Post()
  async createTable(@Body() data: CreateTableDto) {
    return await this.tableService.createTable(data);
  }
}
