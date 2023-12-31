import { BaseEntity } from 'src/base/base.entity';
import { Basket } from 'src/modules/basket/entities/basket.entity';
import { TableEntity } from 'src/modules/qrcode/entities/table.entity';
import { Column, CreateDateColumn, Entity, OneToMany } from 'typeorm';

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

  @Column()
  imageUrl: string;

  @OneToMany(() => TableEntity, (table) => table.branch, { cascade: true })
  tables: TableEntity[];

  @OneToMany(() => Basket, (basket) => basket.branch, { cascade: true })
  orders: Basket[];
}
