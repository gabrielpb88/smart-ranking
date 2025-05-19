import { Injectable, Logger } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './interface/category.interface';
import { RpcException } from '@nestjs/microservices';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  logger = new Logger(CategoryService.name)

  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>){}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      return await this.categoryModel.create(createCategoryDto)
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error)}`)
      throw new RpcException(error.message)
    }
  }

  async findAll(): Promise<Category[]> {
    try {
      return this.categoryModel.find().exec()
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`)
      throw new RpcException(error.message)
    }
  }

  async findById(_id: string): Promise<Category | null> {
    try {
      return this.categoryModel.findById(_id)
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`)
      throw new RpcException(error.message)
    }
  }

  async updateCategory(updateDto: UpdateCategoryDto): Promise<void> {
    try {
      const { _id } = updateDto
      await this.categoryModel.findByIdAndUpdate({ _id }, { $set: updateDto }).exec() 
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`)
      throw new RpcException(error.message)      
    }
  }
}
