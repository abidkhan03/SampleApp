// Import necessary decorators and classes from NestJS
import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Query, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Controller('categories') // Define the route prefix for this controller
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * Create a new category.
   * @param body - The data for the new category.
   * @param request - The HTTP request object.
   * @param response - The HTTP response object.
   * @returns The newly created category or an error message.
   */
  @Post('/create')
  async createCategory(@Body() body: CreateCategoryDto, @Req() request: Request, @Res({ passthrough: true }) response: Response) {
    try {
      const newCategory = new Category();
      Object.assign(newCategory, body);
      const category = await this.categoryService.create(newCategory);
      return category;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  /**
   * Get all categories, optionally filtered by a search term.
   * @param response - The HTTP response object.
   * @param search - An optional search term to filter categories by name.
   * @returns An object containing the list of categories and the search term.
   */
  @Get('/all')
  async getAllCategories(@Res({ passthrough: true }) response: Response, @Query('search') search?: string) {
    const categories = await this.categoryService.findAll(search);
    return {
      categories,
      search
    };
  }

  /**
   * Get a category by its ID.
   * @param id - The ID of the category.
   * @returns The category with the specified ID.
   */
  @Get(':id')
  async getId(@Param('id') id: number) {
    return this.categoryService.findOne(id);
  }

  /**
   * Update a category by its ID.
   * @param id - The ID of the category to update.
   * @param body - The data to update the category with.
   * @returns The updated category or an error message.
   */
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() body: UpdateCategoryDto) {
    try {
      await this.categoryService.update(id, body);
      return this.categoryService.findOne(id);

    } catch (error) {
      console.log(error);
      return error;
    }
  }

  /**
   * Delete a category by its ID.
   * @param id - The ID of the category to delete.
   * @returns The result of the delete operation.
   */
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.categoryService.delete(id);
  }
}