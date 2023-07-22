import { BaseEntity } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Category extends BaseEntity {
  @Column({
    unique: true,
    nullable: true,
  })
  name: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isDeleted: boolean;
}
