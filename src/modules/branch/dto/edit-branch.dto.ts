import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseDto } from 'src/base/dto/base.dto.';
export class EditBranchDto extends BaseDto {
  @ApiProperty({ example: 'Новое имя филиала' })
  name: string;

  @ApiProperty({ example: 'Новое имя менеджера' })
  @IsOptional()
  @IsString()
  managerName: string;

  @ApiProperty({ example: 'Новый адрес текстом' })
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
  locationUrl: string;

  @ApiProperty()
  imageUrl: string;
}
