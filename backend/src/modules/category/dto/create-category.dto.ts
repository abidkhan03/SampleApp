import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class CreateCategoryDto {
    mealId: number;

    @IsNotEmpty({ message: 'name should not be empty' })
    @IsString()
    name: string;
    
}
