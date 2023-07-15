import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ReleaseTableDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  branchId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  tableId: number;
}
