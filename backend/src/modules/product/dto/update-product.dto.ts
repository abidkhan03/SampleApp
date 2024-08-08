import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductsDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;
  
    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    price?: number;
  
    @IsOptional()
    @IsNotEmpty()
    category?: number | string;
}
