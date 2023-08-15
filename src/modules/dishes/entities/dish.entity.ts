import { BaseEntity } from 'src/base/base.entity';
import { Category } from 'src/modules/category/entities/category.entity';
import { Image } from 'src/modules/image/entities/image.entity';
import { MenuItem } from 'src/modules/menu-items/entities/menu-item.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity()
export class Dish extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @OneToOne(() => Image, (image) => image.dish)
  @JoinTable()
  image: Image;

  @ManyToOne(() => Category, (category) => category.dish)
  category: Category;

  @Column({
    type: 'boolean',
    default: false,
  })
  isDeleted: boolean;

  @OneToMany(() => MenuItem, (menuItem) => menuItem.dish)
  @JoinColumn()
  menuItem: MenuItem[];

}
