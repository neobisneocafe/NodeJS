import { IsString } from 'class-validator';
import { BaseEntity } from 'src/base/base.entity';
import { Dish } from 'src/modules/dishes/entities/dish.entity';
import { MenuItem } from 'src/modules/menu-items/entities/menu-item.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity()
export class Image extends BaseEntity {
  @Column()
  @IsString()
  url: string;

  @Column()
  publicId: string;

  @OneToOne(() => Dish, (dish) => dish.image)
  @JoinColumn()
  dish: Dish;

  @OneToOne(() => MenuItem, (item) => item.image)
  item: MenuItem;
}
