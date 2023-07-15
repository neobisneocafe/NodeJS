import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BookTableDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  branchId: number;

  @ApiProperty({ example: '29095MBzgDtOVVrPnadx' })
  @IsNotEmpty()
  @IsString()
  uniqueCode: string;
}
