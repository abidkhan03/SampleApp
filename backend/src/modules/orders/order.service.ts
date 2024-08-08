// Import necessary decorators and services from NestJS
import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Product } from '@modules/product/entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

// Injectable decorator marks the class as a provider that can be injected into other classes
@Injectable()
export class OrdersService {
  constructor(
    // Inject the Order and Product repositories to interact with the database
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  /**
   * Retrieve all orders from the database, including their associated products.
   * @returns A promise that resolves to an array of orders with product relations.
   */
  findAll(): Promise<Order[]> {
    return this.ordersRepository.find({ relations: ['product'] });
  }

  /**
   * Retrieve a single order by its ID.
   * @param id - The ID of the order.
   * @returns A promise that resolves to the order with the specified ID, or null if not found.
   */
  findOne(id: number): Promise<Order> {
    return this.ordersRepository.findOneBy({ id });
  }

  /**
   * Retrieve orders filtered by product ID.
   * @param productId - The ID of the product to filter orders by.
   * @returns A promise that resolves to an array of orders related to the specified product.
   */
  async findByProductId(productId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { product: { id: productId } },
      relations: ['product'],
    });
  }

  /**
   * Create a new order in the database.
   * @param createOrderDto - The data transfer object containing order details.
   * @returns A promise that resolves to the newly created order.
   * @throws NotFoundException if the specified product is not found.
   */
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { orderDate, quantity, productId } = createOrderDto;

    // Find the product associated with the order
    const product = await this.productsRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Create a new order entity
    const order = this.ordersRepository.create({
      orderDate,
      quantity,
      product,
    });

    // Save the order to the database
    return this.ordersRepository.save(order);
  }

  /**
   * Update an existing order in the database.
   * @param id - The ID of the order to update.
   * @param updateOrderDto - The data transfer object containing updated order details.
   * @returns A promise that resolves to the updated order.
   * @throws NotFoundException if the order or product is not found.
   */
  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);

    const { orderDate, quantity, productId } = updateOrderDto;

    if (orderDate !== undefined) {
      order.orderDate = orderDate;
    }

    if (quantity !== undefined) {
      order.quantity = quantity;
    }

    if (productId !== undefined) {
      const product = await this.productsRepository.findOne({ where: { id: productId } });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      order.product = product;
    }

    return this.ordersRepository.save(order);
  }

  /**
   * Remove an order from the database.
   * @param id - The ID of the order to remove.
   * @returns A promise that resolves when the order is removed.
   * @throws NotFoundException if the order is not found.
   */
  async remove(id: number): Promise<void> {
    const result = await this.ordersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }
}