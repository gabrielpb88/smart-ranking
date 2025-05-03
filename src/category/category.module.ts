import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';

@Module({
  imports: [ProxyRMQModule],
  controllers: [CategoryController]
})
export class CategoryModule {}
