import { BaseEntity } from 'src/base/base.entity';
import { Image } from 'src/modules/image/entities/image.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
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
}
