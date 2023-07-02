import { BaseEntity } from 'src/base/base.entity';
import { BranchEntity } from 'src/modules/branch/entities/branch.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class TableEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  uniqueCode: string;

  @Column()
  qrcode: string;

  @ManyToOne(() => BranchEntity, (branch) => branch.tables, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  branch: BranchEntity;
}
