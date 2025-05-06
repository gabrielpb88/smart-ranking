import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { Payload, RmqContext, Ctx, MessagePattern, RpcException } from '@nestjs/microservices';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Logger } from '@nestjs/common';
import { Category } from './interface/category.interface';

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  logger = new Logger(CategoryController.name)

  @MessagePattern('create-category')
  @UsePipes(ValidationPipe)
  async create(@Payload() createCategoryDto: CreateCategoryDto, @Ctx() ctx: RmqContext) {

    this.logger.log(`data: ${JSON.stringify(createCategoryDto)}`)

    const channel = ctx.getChannelRef();
    const originalMessage = ctx.getMessage();

    try {
      await this.categoryService.create(createCategoryDto);
      await channel.ack(originalMessage); 
    } catch (error) {
      this.logger.error(`Error processing message: ${error.message}`);
      await channel.nack(originalMessage, false, false);
    }
  }

  @MessagePattern('find-category')
  async findAll(@Payload() _id: string, @Ctx() ctx: RmqContext) {
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
      throw new RpcException('Invalid ObjectId');
    }
  }

  @MessagePattern('update-category')
  @UsePipes(ValidationPipe)
  async updateCategory(@Payload() data: any, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef();
    const originalMessage = ctx.getMessage();

    try {
      const { _id } = data
      const category: Category = data.category
      await this.categoryService.updateCategory(_id, category)
      await channel.ack(originalMessage)
    } catch (error) {
      this.logger.error(`Error processing message: ${error.message}`);
      await channel.nack(originalMessage, false, false);
    }
  }
}
