import { BaseEntity } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRoleEnum } from '../enums/user.role.enum';

@Entity()
export class User extends BaseEntity {
  @Column({
    unique: true,
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @Column({
    nullable: true,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Column({
    nullable: true,
  })
  @IsDate()
  @IsOptional()
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

  // @Column({ nullable: true })
  // refresh_token_expires: Date;
}
