import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TableService } from './table.service';
import { CreateTableDto } from './dto/create_table.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BookTableDto } from './dto/book_table.dto';
import { UserRoleEnum } from '../user/enums/user.role.enum';
import { Roles } from '../auth/roles/role.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/roles/role.guard';
import { ReleaseTableDto } from './dto/release_table.dto';

@ApiTags('Столики с QR кодом')
@Controller('table')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Roles(UserRoleEnum.USER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Вывести мой забронированный столик' })
  @Get()
  async getMyBookedTable(@Req() req) {
    return await this.tableService.getMyTable(req.user.id);
  }

  @ApiOperation({ summary: 'Вывести все столики одного филиала' })
  @Get(':id')
  async getAllTables(@Param('id') id: number) {
    return await this.tableService.listAllBranchTables(id);
  }

  @ApiOperation({ summary: 'Создать столик с QR кодом' })
  @Post()
  async createTable(@Body() data: CreateTableDto) {
    return await this.tableService.createTable(data);
  }

  @Roles(UserRoleEnum.USER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Забронировать столик' })
  @Post('book')
  async bookTable(@Req() req, @Body() bookTableDto: BookTableDto) {
    return await this.tableService.bookTable(req.user.id, bookTableDto);
  }

  @ApiOperation({ summary: 'Освободить столик' })
  @Post('release')
  async releaseTable(@Body() releaseTableDto: ReleaseTableDto) {
    return await this.tableService.releaseTable(1, releaseTableDto);
  }
}
