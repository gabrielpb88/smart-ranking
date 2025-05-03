import { Injectable, Logger } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  logger = new Logger(CategoryService.name)

  create(createCategoryDto: CreateCategoryDto) {
    this.logger.log(`data: ${JSON.stringify(createCategoryDto)}`)
    return 'This action adds a new category';
  }
}
