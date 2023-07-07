import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { BaseDto } from 'src/base/dto/base.dto.';

export class ConfirmAccountDto extends BaseDto {
  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @MaxLength(4)
  @MinLength(4)
  code: string;
}
