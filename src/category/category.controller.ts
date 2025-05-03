import { Controller, Post, Body, ValidationPipe, UsePipes } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { ClientProxy } from '@nestjs/microservices';

@Controller('api/v1/category')
export class CategoryController {

  private readonly clientProxy: ClientProxy

  constructor(private readonly clientProxySmartRanking: ClientProxySmartRanking) {
    this.clientProxy = this.clientProxySmartRanking.getClientProxyAdminBackendInstance()
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    this.clientProxy.emit('create-category', createCategoryDto);
  }

}
