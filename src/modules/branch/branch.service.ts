import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base/base.service';
import { BranchEntity } from './entities/branch.entity';
import { Repository } from 'typeorm';
import { CreateBranchDto } from './dto/create-branch.dto';
import { EditBranchDto } from './dto/edit-branch.dto';

@Injectable()
export class BranchService extends BaseService<BranchEntity> {
  constructor(
    @InjectRepository(BranchEntity)
    private readonly branchRepo: Repository<BranchEntity>,
  ) {
    super(branchRepo);
  }
  async getOne(id: number) {
    return await this.branchRepo.findOne({ where: { id: id } });
  }

  async getAll() {
    return await this.branchRepo.find({ relations: ['tables'] });
  }
  async createOne(data: CreateBranchDto) {
    const branch = new BranchEntity();
    branch.absorbFromDto(data);
    return await this.branchRepo.save(branch);
  }

  async editOne(branchId, data: EditBranchDto) {
    const branch = await this.branchRepo.findOne({ where: { id: branchId } });
    branch.absorbFromDto(data);
    // log(branch);
    return await this.branchRepo.save(branch);
  }

  async deleteOne(id: number) {
    const branch = await this.branchRepo.findOne({ where: { id: id } });
    if (branch) {
      return await this.branchRepo.remove(branch);
    }
  }

  // ========================================================
}
