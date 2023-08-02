import { BaseEntity } from 'src/base/base.entity';
import { Category } from 'src/modules/category/entities/category.entity';
import { Image } from 'src/modules/image/entities/image.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToOne } from 'typeorm';

@Entity()
export class Dish extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: string;

  @OneToOne(() => Image, (image) => image.dish)
  @JoinTable()
  image: Image;

  @ManyToOne(() => Category, (category) => category.dish)
  category: Category;
}
