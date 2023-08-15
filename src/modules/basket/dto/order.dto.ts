import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class OrderDto {
  @ApiProperty({ example: 'Уникальный код столика' })
  @IsNotEmpty()
  @IsString()
  uniqueCode: string;

  @ApiProperty({ example: [1, 2] })
  @IsNotEmpty()
  @IsArray()
  dishId: number[];

  @ApiProperty({ example: 50 })
  @IsOptional()
  bonusPoints: number;
}
