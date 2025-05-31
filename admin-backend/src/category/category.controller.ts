import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { Payload, RmqContext, Ctx, MessagePattern, RpcException } from '@nestjs/microservices';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Logger } from '@nestjs/common';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './interface/category.interface';

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  logger = new Logger(CategoryController.name)

  @MessagePattern('create-category')
  @UsePipes(ValidationPipe)
  async create(@Payload() createCategoryDto: CreateCategoryDto, @Ctx() ctx: RmqContext): Promise<Category> {

    this.logger.log(`data: ${JSON.stringify(createCategoryDto)}`)

    const channel = ctx.getChannelRef();
    const originalMessage = ctx.getMessage();

    try {
      const createdCAtegory = await this.categoryService.create(createCategoryDto);
      await channel.ack(originalMessage);
      return createdCAtegory 
    } catch (error) {
      this.logger.error(`Error processing message: ${error.message}`);
      await channel.nack(originalMessage, false, false);
      throw new RpcException(error.message)
    }
  }

  @MessagePattern('find-category')
  async find(@Payload() _id: string | null, @Ctx() ctx: RmqContext):Promise<Category[] | Category> {
    const channel = ctx.getChannelRef();
    const originalMessage = ctx.getMessage();

    let result

    try {
      if(_id) {
        result = await this.categoryService.findById(_id);
      } else {
        result = await this.categoryService.findAll();
      }
      await channel.ack(originalMessage)
      return result
    } catch (error) {
      this.logger.error(`Error processing message: ${error.message}`);
      await channel.nack(originalMessage, false, false);
      throw new RpcException(error.message);
    }
  }

  @MessagePattern('update-category')
  @UsePipes(ValidationPipe)
  async updateCategory(@Payload() updateDto: UpdateCategoryDto, @Ctx() ctx: RmqContext):Promise<Category | null> {
    const channel = ctx.getChannelRef();
    const originalMessage = ctx.getMessage();

    try {
      const updatedCategory = await this.categoryService.updateCategory(updateDto)
      await channel.ack(originalMessage)
      return updatedCategory
    } catch (error) {
      this.logger.error(`Error processing message: ${error.message}`);
      await channel.nack(originalMessage, false, false);
      throw new RpcException(error.message)
    }
  }
}
