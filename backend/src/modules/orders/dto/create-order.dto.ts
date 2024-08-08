import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsDate } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ required: true })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  orderDate: Date;

  @ApiProperty({ required: true })
  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ required: true })
  @IsInt()
  @IsNotEmpty()
  productId: number;

}
