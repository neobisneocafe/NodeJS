import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class AddBonusDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({ example: 500 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1000)
  bonusPoints: number;
}
