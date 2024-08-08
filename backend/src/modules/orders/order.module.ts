import { Module } from '@nestjs/common';
import { OrdersService } from './order.service';
import { OrdersController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { UserModule } from '../user/user.module';
import { CategoryModule } from '@modules/category/category.module';
import { ProductsModule } from '@modules/product/product.module';
import { Product } from '@modules/product/entities/product.entity';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    TypeOrmModule.forFeature([Order, Product]),
    UserModule,
    ProductsModule
  ],
  exports: [OrdersService]
})
export class OrdersModule { }
