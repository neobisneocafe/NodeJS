import { BaseDto } from 'src/base/dto/base.dto.';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumberDecorator } from 'src/utils/decorators/is-phone-number.decorator';

export class CreateUserDto extends BaseDto {
  @ApiProperty({
    example: 'Player',
    description: 'Firstname of a user',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: '996555010101',
  })
  @IsPhoneNumberDecorator()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}
