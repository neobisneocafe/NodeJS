import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base/base.service';
import { BranchEntity } from './entities/branch.entity';
import { Repository } from 'typeorm';
import { CreateBranchDto } from './dto/create-branch.dto';

@Injectable()
export class BranchService extends BaseService<BranchEntity> {
  constructor(
    @InjectRepository(BranchEntity)
    private readonly branchRepo: Repository<BranchEntity>,
  ) {
    super(branchRepo);
  }

  async getAll() {
    return await this.branchRepo.find({ relations: ['tables'] });
  }
  async createOne(data: CreateBranchDto) {
    return await this.branchRepo.save(data);
  }

  async deleteOne(id: number) {
    const branch = await this.branchRepo.findOne({ where: { id: id } });
    return await this.branchRepo.remove(branch);
  }
}
