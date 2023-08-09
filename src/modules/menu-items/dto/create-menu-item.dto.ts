import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BaseDto } from 'src/base/dto/base.dto.';

export class CreateMenuItemDto extends BaseDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image_url: string;

  @ApiProperty()
  @IsString()
  price: string;

  @ApiProperty()
  @IsString()
  quantity: string;

  @ApiProperty()
  @IsString()
  min_limit: string;
}
