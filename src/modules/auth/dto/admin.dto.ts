import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseDto } from 'src/base/dto/base.dto.';

export class LoginAdminDto extends BaseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
