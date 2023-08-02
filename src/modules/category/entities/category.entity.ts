import { BaseEntity } from 'src/base/base.entity';
import { Dish } from 'src/modules/dishes/entities/dish.entity';
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';

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

  @OneToMany(() => Dish, (dish) => dish.category)
  // @JoinColumn()
  dish: Dish[];
}
