import { BaseEntity } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';
import { UserRoleEnum } from '../enums/user.role.enum';

@Entity()
export class User extends BaseEntity {
  @Column({
    unique: true,
  })
  phoneNumber: string;

  @Column({
    nullable: true,
  })
  firstName: string;

  @Column({
    nullable: true,
  })
  dateOfBirth: Date;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.USER,
  })
  role: UserRoleEnum;

  @Column({
    type: 'boolean',
    default: false,
  })
  confirmed: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  isDeleted: boolean;

  @Column({
    nullable: true,
  })
  refresh_token: string;

  @Column({
    nullable: true,
  })
  login_code: string;

  // @Column({ nullable: true })
  // refresh_token_expires: Date;
}
