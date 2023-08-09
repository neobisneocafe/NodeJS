import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Body,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { BranchService } from './branch.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateBranchDto } from './dto/create-branch.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from '../image/image.service';
import { EditBranchDto } from './dto/edit-branch.dto';

@ApiTags('Филиалы')
@Controller('branch')
export class BranchController {
  constructor(
    private readonly branchService: BranchService,
    private readonly imageService: ImageService,
  ) {}

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

  @Post()
  @ApiOperation({ summary: 'Создать один филиал' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: '1 Филиал' },
        managerName: {
          type: 'string',
          example: 'ФИО менеджера',
          nullable: true,
        },
        adress: { type: 'string', example: 'Адрес текстом' },
        city: { type: 'string', example: 'Бишкек', nullable: true },
        email: {
          type: 'string',
          example: 'neocafe2023@gmail.com',
          nullable: true,
        },
        opening_time: { type: 'string', example: '2023-03-22T10:30:40.000Z' },
        closing_time: { type: 'string', example: '2023-03-22T10:30:40.000Z' },
        locationUrl: {
          type: 'string',
          nullable: true,
          example: 'https://2gis.kg/bishkek/geo/70000001019343641',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  async createBranch(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: CreateBranchDto,
  ) {
    if (!file) throw new BadRequestException('Файл не найден');
    const image = await this.imageService.createImage(file);
    data.imageUrl = image.url;
    return await this.branchService.createOne(data);
  }

  @Patch(':branchId')
  @ApiOperation({ summary: 'Редактировать один филиал' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: '2 Филиал' },
        managerName: {
          type: 'string',
          example: 'ФИО менеджера',
          nullable: true,
        },
        adress: { type: 'string', example: 'Новый адрес текстом' },
        city: { type: 'string', example: 'Ош', nullable: true },
        email: {
          type: 'string',
          example: 'neocafe2023@gmail.com',
          nullable: true,
        },
        opening_time: { type: 'string', example: '2023-03-22T10:30:40.000Z' },
        closing_time: { type: 'string', example: '2023-03-22T10:30:40.000Z' },
        locationUrl: {
          type: 'string',
          nullable: true,
          example: 'https://2gis.kg/bishkek/geo/70000001019343641',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  async editBranch(
    @Param('branchId') branchId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() data: EditBranchDto,
  ) {
    const image = await this.imageService.createImage(file);
    data.imageUrl = image.url;
    return await this.branchService.editOne(branchId, data);
  }

  @ApiOperation({ summary: 'Удалить один филиал' })
  @Delete(':id')
  async deleteBranch(@Param('id') id: number) {
    return await this.branchService.deleteOne(id);
  }
}
