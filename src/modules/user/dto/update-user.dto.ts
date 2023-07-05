import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { BaseDto } from 'src/base/dto/base.dto.';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumberDecorator } from '../../../utils/decorators/is-phone-number.decorator';

export class UpdateUserDto extends BaseDto {
  @ApiProperty({
    example: 'Player',
    description: 'Firstname of a user',
  })
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty({
    example: '996555010101',
  })
  @IsPhoneNumberDecorator()
  @IsString()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({
    description: 'Birthday',
    example: '2001-07-23T10:30:40.000Z',
    required: false,
  })
  @IsOptional()
  dateOfBirth: Date;

  updatedAt?: Date;
}
