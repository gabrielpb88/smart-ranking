import { Injectable, Logger } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './interface/category.interface';

@Injectable()
export class CategoryService {
  logger = new Logger(CategoryService.name)

  constructor(@InjectModel('Category') private readonly categoryModel: Model<Category>){}

  async create(createCategoryDto: CreateCategoryDto): Promise<void> {
    this.logger.log(`data: ${JSON.stringify(createCategoryDto)}`)

    try {
      const categoryCreated = await this.categoryModel.create(createCategoryDto)
      await categoryCreated.save()
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error)}`)
      throw new Error(error.message)
    }
  }

  async findAll(): Promise<Category[]> {
    try {
      return this.categoryModel.find().exec()
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`)
      throw new Error(error.message)
    }
  }
}
