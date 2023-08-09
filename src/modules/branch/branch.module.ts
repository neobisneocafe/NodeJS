import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchEntity } from './entities/branch.entity';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [TypeOrmModule.forFeature([BranchEntity]), ImageModule],
  providers: [BranchService],
  controllers: [BranchController],
  exports: [BranchService],
})
export class BranchModule {}
