import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { BaseDto } from 'src/base/dto/base.dto.';
export class CreateBranchDto extends BaseDto {
  @ApiProperty({ example: 'Имя филиала' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Имя менеджера' })
  @IsOptional()
  @IsString()
  managerName: string;

  @ApiProperty({ example: 'Адрес текстом' })
  @IsNotEmpty()
  @IsString()
  adress: string;

  @ApiProperty({ example: 'Город' })
  @IsOptional()
  @IsString()
  city: string;

  @ApiProperty({ example: 'neocafe2023@gmail.com' })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '2023-03-22T10:30:40.000Z' })
  @IsNotEmpty()
  opening_time: Date;

  @ApiProperty({ example: '2023-03-22T10:30:40.000Z' })
  @IsNotEmpty()
  closing_time: Date;

  @ApiProperty({ example: 'https://2gis.kg/bishkek/geo/70000001019343641' })
  @IsOptional()
  @IsUrl()
  locationUrl: string;

  @ApiProperty()
  imageUrl: string;
}
