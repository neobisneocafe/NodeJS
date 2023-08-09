import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class OrderDto {
  @ApiProperty({ example: [1, 2] })
  @IsNotEmpty()
  @IsArray()
  dishId: number[];
}
