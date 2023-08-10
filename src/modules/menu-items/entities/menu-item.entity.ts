import { BaseEntity } from 'src/base/base.entity';
import { Dish } from 'src/modules/dishes/entities/dish.entity';
import { Image } from 'src/modules/image/entities/image.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';

@Entity()
export class MenuItem extends BaseEntity {
  @Column({
    nullable: true,
  })
  name: string;

  @Column({
    nullable: true,
  })
  image_url: string;

  @Column({
    nullable: true,
  })
  price: string;

  @Column({
    nullable: true,
  })
  quantity: string;

  @Column({
    nullable: true,
  })
  min_limit: string;

  @CreateDateColumn()
  arrivalDate: Date;

  @OneToOne(() => Image, (image) => image.item)
  image: Image;

  @ManyToOne(() => Dish, (dish) => dish.menuItem, { cascade: true })
  @JoinColumn()
  dish: Dish;
}
