import { BaseEntity } from 'src/base/base.entity';
import { Column, CreateDateColumn, Entity } from 'typeorm';

@Entity()
export class BranchEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  managerName: string;

  @Column()
  adress: string;

  @Column()
  city: string;

  @CreateDateColumn()
  opening_time: Date;

  @CreateDateColumn()
  closing_time: Date;

  @Column()
  email: string;

  @Column()
  locationUrl: string;
}
