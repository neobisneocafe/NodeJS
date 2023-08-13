import { BaseEntity } from 'src/base/base.entity';
import { UserRoleEnum } from 'src/modules/user/enums/user.role.enum';
import { Column, CreateDateColumn, Entity } from 'typeorm';

@Entity()
export class Barista extends BaseEntity {
  @Column({
    nullable: true,
  })
  phoneNumber: string;

  @Column({
    nullable: true,
  })
  firstName: string;

  @Column({
    nullable: true,
  })
  lastName: string;

  @CreateDateColumn()
  bithDate: Date;

  @Column({
    nullable: true,
  })
  refresh_token: string;

  @Column({
    nullable: true,
  })
  login_code: string;

  @Column({
    default: true,
  })
  confirm: boolean;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.BARISTA,
  })
  role: UserRoleEnum;

  @Column({
    default: false,
  })
  isCodeUsed: boolean;
}
