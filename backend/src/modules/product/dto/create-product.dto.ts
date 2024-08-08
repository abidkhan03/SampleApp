import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty({ message: 'name should not be empty' })
    name: string;

    @IsNotEmpty({ message: 'price should not be empty' })
    price: number;

    @IsNotEmpty()
    category: number | string;

}
