import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TableEntity } from './entities/table.entity';
import { TableController } from './table.controller';
import { TableService } from './table.service';
import { BranchEntity } from '../branch/entities/branch.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TableEntity, BranchEntity])],
  providers: [TableService],
  controllers: [TableController],
})
export class QrcodeModule {}
