import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsDate } from 'class-validator';

export class UpdateOrderDto {
  @ApiPropertyOptional()
  @IsDate()
  @IsOptional()
  orderDate?: Date;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  quantity?: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  productId?: number;

}
