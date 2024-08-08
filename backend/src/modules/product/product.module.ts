import { Module } from '@nestjs/common';
import { ProductsService } from './product.service';
import { ProductsController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { CategoryModule } from '../category/category.module';
import { Category } from '../category/entities/category.entity';
import { JwtService } from '@nestjs/jwt';
import { Product } from './entities/product.entity';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, JwtService],
  imports: [
    TypeOrmModule.forFeature([Product, Category]), 
    UserModule, 
    CategoryModule,
  ],
  exports: [ProductsService]
})
export class ProductsModule {}
