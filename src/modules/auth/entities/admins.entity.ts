import { BaseEntity } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Admin extends BaseEntity {
  @Column({
    unique: true,
    nullable: true,
  })
  username: string;

  @Column({
    unique: true,
    nullable: true,
  })
  password: string;

  @Column({
    nullable: true,
  })
  refresh_token: string;

  @Column({ default: false }) // Новое поле для определения наличия администратора
  hasAdmin: boolean;
}
