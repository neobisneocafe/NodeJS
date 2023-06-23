import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsNotEmpty, IsString, IsUrl } from 'class-validator';
export class CreateBranchDto {
  @ApiProperty({ example: 'Имя филиала' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Имя менеджера' })
  @IsNotEmpty()
  @IsString()
  managerName: string;

  @ApiProperty({ example: 'Адрес текстом' })
  @IsNotEmpty()
  @IsString()
  adress: string;

  @ApiProperty({ example: 'Город' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ example: 'neocafe2023@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '2023-03-22T10:30:40.000Z' })
  @IsNotEmpty()
  opening_time: Date;

  @ApiProperty({ example: '2023-03-22T10:30:40.000Z' })
  @IsNotEmpty()
  closing_time: Date;

  @ApiProperty({ example: 'https://2gis.kg/bishkek/geo/70000001019343641' })
  @IsNotEmpty()
  @IsUrl()
  locationUrl: string;
}
