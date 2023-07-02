import { BaseEntity } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class TableEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  uniqueCode: string;

  @Column()
  qrcode: string;
}
