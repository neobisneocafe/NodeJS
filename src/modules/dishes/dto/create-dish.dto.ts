import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { BaseDto } from "src/base/dto/base.dto.";
import { Image } from "src/modules/image/entities/image.entity";

export class CreateDishDto extends BaseDto {
    @ApiProperty()
    @IsString()
    name:string

    @ApiProperty()
    @IsString()
    description:string

    @ApiProperty()
    @IsString()
    @IsOptional()
    price:string

    @ApiProperty()
    image:Image

    @ApiProperty()
    @IsString()
    category:string
}
