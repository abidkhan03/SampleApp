// Import necessary decorators and classes from NestJS
import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { OrdersService } from './order.service';
import { Order } from './entities/order.entity';
import { UsersService } from '../user/user.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders') // Define the route prefix for this controller
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly userService: UsersService,
  ) {}

  /**
   * Retrieve all orders or filter by product ID if provided.
   * @param productId - Optional product ID to filter orders by.
   * @returns A promise that resolves to an array of orders.
   */
  @Get()
  async findAll(@Query('productId') productId?: number): Promise<Order[]> {
    if (productId) {
      return this.ordersService.findByProductId(productId);
    }
    return this.ordersService.findAll();
  }

  /**
   * Retrieve an order by its ID.
   * @param id - The ID of the order.
   * @returns A promise that resolves to the order with the specified ID.
   */
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Order> {
    return this.ordersService.findOne(+id);
  }

  /**
   * Create a new order.
   * @param createOrderDto - The data transfer object containing order details.
   * @returns A promise that resolves to the newly created order.
   */
  @Post('/create')
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createOrderDto);
  }

  /**
   * Update an order by its ID.
   * @param id - The ID of the order to update.
   * @param updateOrderDto - The data transfer object containing updated order details.
   * @returns A promise that resolves to the updated order.
   */
  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.ordersService.update(+id, updateOrderDto);
  }

  /**
   * Remove an order by its ID.
   * @param id - The ID of the order to remove.
   * @returns A promise that resolves when the order is removed.
   */
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.ordersService.remove(+id);
  }
}
