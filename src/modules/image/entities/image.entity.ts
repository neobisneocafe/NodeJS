import { IsString } from 'class-validator';
import { BaseEntity } from 'src/base/base.entity';
import { Dish } from 'src/modules/dishes/entities/dish.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity()
export class Image extends BaseEntity {
  @Column()
  @IsString()
  url: string;

  @Column()
  publicId: string;

  @OneToOne(()=>Dish,(dish)=>dish.image)
  @JoinColumn()
  dish:Dish
}
