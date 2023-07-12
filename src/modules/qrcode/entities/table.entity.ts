import { BaseEntity } from 'src/base/base.entity';
import { BranchEntity } from 'src/modules/branch/entities/branch.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';

@Entity()
export class TableEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  uniqueCode: string;

  @Column()
  qrcode: string;

  @Column({ default: false })
  isBooked: boolean;

  @ManyToOne(() => User, (user) => user.table, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => BranchEntity, (branch) => branch.tables, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  branch: BranchEntity;
}
