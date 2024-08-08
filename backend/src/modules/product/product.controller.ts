// Import necessary decorators and classes from NestJS
import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './product.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@modules/user/auth/auth.guard';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductsDto } from './dto/update-product.dto';

@Controller('products') // Define the route prefix for this controller
export class ProductsController {
  constructor(
    private readonly productService: ProductsService,
    private readonly jwtService: JwtService
  ) {}

  /**
   * Retrieve all products.
   * @returns A promise that resolves to an array of products.
   */
  @Get()
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  /**
   * Retrieve a product by its ID.
   * @param id - The ID of the product.
   * @returns A promise that resolves to the product with the specified ID.
   */
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Product> {
    return this.productService.findOne(+id);
  }

  /**
   * Create a new product.
   * @param createProductDto - The data transfer object containing product details.
   * @returns A promise that resolves to the newly created product.
   */
  @Post('/create')
  @UsePipes(new ValidationPipe())
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    try {
      return await this.productService.create(createProductDto);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   * Update a product by its ID.
   * @param id - The ID of the product to update.
   * @param updateProductDto - The data transfer object containing updated product details.
   * @returns A promise that resolves to the updated product.
   */
  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductsDto,
  ): Promise<Product> {
    try {
      return await this.productService.update(+id, updateProductDto);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   * Remove a product by its ID.
   * @param id - The ID of the product to remove.
   * @returns A promise that resolves when the product is removed.
   */
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.productService.remove(id);
  }
}