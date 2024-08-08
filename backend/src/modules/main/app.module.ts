// Import necessary modules and decorators from NestJS and other packages
import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller'; // Main application controller
import { AppService } from './app.service'; // Main application service
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonModule } from '../common/common.module'; // Common module for shared services or components
import { UserEntity } from '../user/entities/user.entity'; // User entity
import { UserModule } from '../user/user.module'; // User module
import { CategoryModule } from '../category/category.module'; // Category module
import { ProductsModule } from '../product/product.module'; // Products module
import { OrdersModule } from '../orders/order.module'; // Orders module
import { Category } from '@modules/category/entities/category.entity'; // Category entity
import { Product } from '@modules/product/entities/product.entity'; // Product entity
import { Order } from '@modules/orders/entities/order.entity'; // Order entity

@Global() // Marking the module as global, making providers available throughout the application
@Module({
  imports: [
    // Asynchronously configure TypeORM with connection options from ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule to access environment variables
      inject: [ConfigService], // Inject ConfigService to use it in the factory function
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.get('DB_TYPE'), // Database type (e.g., 'mysql', 'postgres')
          host: configService.get('DB_HOST'), // Database host
          port: configService.get('DB_PORT'), // Database port
          username: configService.get('DB_USERNAME'), // Database username
          password: configService.get('DB_PASSWORD'), // Database password
          database: configService.get('DB_DATABASE'), // Database name
          entities: [ // Register entities for the database connection
            UserEntity,
            Category,
            Product,
            Order,
          ],
          synchronize: configService.get('DB_SYNC') === 'true', // Auto-synchronize the database schema with entities
          keepConnectionAlive: true, // Keep the database connection alive between requests
        } as TypeOrmModuleAsyncOptions;
      },
    }),
    ConfigModule.forRoot({
      envFilePath: '.env', // Specify the path to the .env file
      isGlobal: true, // Make ConfigModule available globally across the application
    }),
    CommonModule, // Import the common module
    UserModule, // Import the user module
    CategoryModule, // Import the category module
    ProductsModule, // Import the products module
    OrdersModule, // Import the orders module
  ],
  controllers: [AppController], // Register the main application controller
  providers: [AppService], // Register the main application service
})
export class AppModule {}
