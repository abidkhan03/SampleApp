// Import necessary decorators and services from NestJS
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, In, Like } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    // Inject the Category repository to interact with the database
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * Create a new category in the database.
   * @param addCategory - The category to be added.
   * @returns The newly created category.
   */
  create(addCategory: Category) {
    return this.categoryRepository.save(
      this.categoryRepository.create(addCategory),
    );
  }

  /**
   * Retrieve a category by its ID.
   * @param id - The ID of the category.
   * @returns The category with the specified ID, or null if not found.
   */
  async getCategoryById(id: number): Promise<Category> {
    return this.categoryRepository.findOne({ where: { id } });
  }

  /**
   * Find all categories, optionally filtered by a search term.
   * @param searchTerm - An optional search term to filter categories by name.
   * @returns A list of categories that match the search criteria.
   */
  async findAll(searchTerm?: string): Promise<Category[]> {
    if (searchTerm) {
      return await this.categoryRepository.find({
        where: { name: Like(`%${searchTerm}%`) },
        take: 10, // Limit the number of results to 10
        order: { name: 'ASC' }, // Order results alphabetically by name
      });
    } else {
      return await this.categoryRepository.find({
        take: 10,
        order: { name: 'ASC' },
      });
    }
  }

  /**
   * Retrieve all categories without filtering.
   * @returns A list of all categories ordered by name.
   */
  async findAllCategories(): Promise<Category[]> {
    return await this.categoryRepository.find({
      select: ["name", "id"], // Select only name and id fields
      order: { name: 'ASC' },
    });
  }

  /**
   * Find categories by a search term with a limit on results.
   * @param searchTerm - An optional search term to filter categories by name.
   * @returns A list of categories that match the search criteria.
   */
  async findCategories(searchTerm?: string): Promise<Category[]> {
    if (searchTerm && searchTerm.trim()) {
      return await this.categoryRepository.find({
        where: {
          name: Like(`%${searchTerm}%`)
        },
        take: 5, // Limit results to 5
        order: { name: 'ASC' }, // Order by name ascending
      });
    } else {
      // If no search term is provided, return a limited list of categories.
      return await this.categoryRepository.find({
        take: 10,
        order: { name: 'ASC' },
      });
    }
  }

  /**
   * Find a single category by its ID.
   * @param id - The ID of the category.
   * @returns The category with the specified ID.
   * @throws Error if the ID is not a valid number.
   */
  async findOne(id: number) {
    if (isNaN(id)) {
      throw new Error('Invalid category ID');
    }
    return this.categoryRepository.findOne({
      where: { id: id },
    });
  }

  /**
   * Update a category with the provided data.
   * @param id - The ID of the category to update.
   * @param data - The data to update the category with.
   * @returns The result of the update operation.
   */
  async update(id: number, data: any): Promise<any> {
    return this.categoryRepository.update(id, data);
  }

  /**
   * Find categories by their IDs.
   * @param ids - An array of category IDs.
   * @returns A list of categories with the specified IDs.
   */
  findByIds(ids: number[]) {
    return this.categoryRepository.find({
      where: { id: In(ids) },
    });
  }

  /**
   * Delete a category by its ID.
   * @param id - The ID of the category to delete.
   * @returns The result of the delete operation.
   */
  async delete(id: number) {
    return this.categoryRepository.delete(id);
  }
}