import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base/base.service';
import { BranchEntity } from './entities/branch.entity';
import { Repository } from 'typeorm';
import { CreateBranchDto } from './dto/create-branch.dto';
import { log } from 'console';
import { ImageService } from '../image/image.service';

@Injectable()
export class BranchService extends BaseService<BranchEntity> {
  constructor(
    @InjectRepository(BranchEntity)
    private readonly branchRepo: Repository<BranchEntity>,
    private readonly imageService: ImageService,
  ) {
    super(branchRepo);
  }

  async getAll() {
    return await this.branchRepo.find({ relations: ['tables'] });
  }
  async createOne(data: CreateBranchDto) {
    const branch = new BranchEntity();
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
}
