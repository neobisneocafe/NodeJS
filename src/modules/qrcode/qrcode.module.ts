import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TableEntity } from './entities/table.entity';
import { TableController } from './table.controller';
import { TableService } from './table.service';
import { BranchEntity } from '../branch/entities/branch.entity';
import { UserModule } from '../user/user.module';
import { TablesGateway } from './table.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([TableEntity, BranchEntity]), UserModule],
  providers: [TableService, TablesGateway],
  controllers: [TableController],
})
export class QrcodeModule {}
