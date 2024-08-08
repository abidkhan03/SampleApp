// create-user.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { SameAs } from '@modules/common/validator/same-as-validator';

export class CreateUserDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @MinLength(5)
  password: string;

  @ApiProperty({ required: true })
  @SameAs('password')
  passwordConfirmation: string;

  // @ApiProperty({ required: true })
  // @IsNotEmpty()
  // role_name: string;
}
