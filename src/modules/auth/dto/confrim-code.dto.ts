import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Entity } from 'typeorm';

@Entity()
export class ConfrimCodeDto {
  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  code: string;
}
