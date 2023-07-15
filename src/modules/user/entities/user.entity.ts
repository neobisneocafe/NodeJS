import { BaseEntity } from 'src/base/base.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { UserRoleEnum } from '../enums/user.role.enum';
import { TableEntity } from 'src/modules/qrcode/entities/table.entity';

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

  @OneToMany(() => TableEntity, (table) => table.user, { cascade: true })
  @JoinColumn()
  table: TableEntity[];

  // @Column({ nullable: true })
  // refresh_token_expires: Date;
}
