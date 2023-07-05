import { IsNotEmpty, IsString } from 'class-validator';
import { BaseEntity } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class ConfirmCode extends BaseEntity {
  @Column({
    unique: true,
    nullable: true,
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @Column()
  code: string;
}
