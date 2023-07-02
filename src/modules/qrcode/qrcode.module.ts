import { Module } from '@nestjs/common';
import { QrcodeService } from './qrcode.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TableEntity } from './entities/table.entity';
import { TableController } from './table.controller';
import { TableService } from './table.service';

@Module({
  imports: [TypeOrmModule.forFeature([TableEntity])],
  providers: [QrcodeService, TableService],
  controllers: [TableController],
})
export class QrcodeModule {}
