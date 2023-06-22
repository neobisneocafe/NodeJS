import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { BranchService } from './branch.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateBranchDto } from './dto/create-branch.dto';

@ApiTags('Филиалы')
@Controller('branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @ApiOperation({ summary: 'Вывести все филиалы' })
  @Get()
  async getAllBranches() {
    return await this.branchService.getAll();
  }

  @ApiOperation({ summary: 'Вывести один филиал' })
  @Get('/:id')
  async getOneBranch(@Param('id') id: number) {
    return await this.branchService.get(id);
  }

  @ApiOperation({ summary: 'Создать один филиал' })
  @Post()
  async createBranch(@Body() data: CreateBranchDto) {
    return await this.branchService.createOne(data);
  }

  @ApiOperation({ summary: 'Удалить один филиал' })
  @Delete()
  async deleteBranch(@Param('id') id: number) {
    return await this.branchService.deleteOne(id);
  }
}
