// Import necessary decorators and services from NestJS
import { Injectable, NotFoundException, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../category/entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductsDto } from './dto/update-product.dto';

// Injectable decorator marks the class as a provider that can be injected into other classes
@Injectable()
export class ProductsService {
  constructor(
    // Inject the Product and Category repositories to interact with the database
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  /**
   * Retrieve all products from the database, including their associated categories.
   * @returns A promise that resolves to an array of products with category relations.
   */
  findAll(): Promise<Product[]> {
    return this.productRepository.find({ relations: ['category'] });
  }

  /**
   * Retrieve a single product by its ID.
   * @param id - The ID of the product.
   * @returns A promise that resolves to the product with the specified ID, or null if not found.
   */
  findOne(id: number): Promise<Product> {
    return this.productRepository.findOneBy({ id });
  }

  /**
   * Create a new product in the database.
   * @param createProductDto - The data transfer object containing product details.
   * @returns A promise that resolves to the newly created product.
   * @throws NotFoundException if the specified category is not found.
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { name, price, category } = createProductDto;

    // Determine if the category is specified by ID or name
    let categoryEntity: Category;
    if (typeof category === 'number') {
      categoryEntity = await this.categoryRepository.findOneBy({ id: category });
    } else {
      categoryEntity = await this.categoryRepository.findOneBy({ name: category });
    }

    if (!categoryEntity) {
      throw new NotFoundException('Category not found');
    }

    // Create a new product entity
    const product = this.productRepository.create({
      name,
      price,
      category: categoryEntity,
    });

    // Save the product to the database
    return this.productRepository.save(product);
  }

  /**
   * Update an existing product in the database.
   * @param id - The ID of the product to update.
   * @param updateProductDto - The data transfer object containing updated product details.
   * @returns A promise that resolves to the updated product.
   * @throws NotFoundException if the product or category is not found.
   */
  async update(id: number, updateProductDto: UpdateProductsDto): Promise<Product> {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const { name, price, category } = updateProductDto;

    if (name !== undefined) {
      product.name = name;
    }

    if (price !== undefined) {
      product.price = price;
    }

    if (category !== undefined) {
      let categoryEntity: Category;
      if (typeof category === 'number') {
        categoryEntity = await this.categoryRepository.findOneBy({ id: category });
      } else {
        categoryEntity = await this.categoryRepository.findOneBy({ name: category });
      }

      if (!categoryEntity) {
        throw new NotFoundException('Category not found');
      }

      product.category = categoryEntity;
    }

    return this.productRepository.save(product);
  }

  /**
   * Remove a product from the database.
   * @param id - The ID of the product to remove.
   * @returns A promise that resolves when the product is removed.
   * @throws NotFoundException if the product is not found.
   */
  async remove(id: number): Promise<void> {
    const result = await this.productRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  /**
   * Search for products based on a search term.
   * @param searchTerm - An optional search term to filter products by name.
   * @returns A promise that resolves to an array of products matching the search criteria.
   */
  async findBySearch(searchTerm?: string): Promise<Product[]> {
    const searchOptions = {
      where: {
        ...(searchTerm && { name: Like(`%${searchTerm}%`) }),
      },
      relations: ['category'],
    };

    return await this.productRepository.find(searchOptions);
  }
}