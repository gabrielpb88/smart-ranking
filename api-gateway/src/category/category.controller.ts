import { Controller, Post, Get, Put, Body, Query, Param, ValidationPipe, UsePipes, UseGuards } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('api/v1/category')
export class CategoryController {

  private readonly clientProxy: ClientProxy

  constructor(private readonly clientProxySmartRanking: ClientProxySmartRanking) {
    this.clientProxy = this.clientProxySmartRanking.getClientProxyAdminBackendInstance()
  }

  @Post()
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    this.clientProxy.emit('create-category', createCategoryDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Query('_id') _id: string): Observable<any> {
    return this.clientProxy.send('find-category', _id ? _id : '')
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  updateCategory(
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param('_id') _id: string
  ) {
    const category = updateCategoryDto
    return this.clientProxy.emit('update-category', { _id, category })
  }

}
