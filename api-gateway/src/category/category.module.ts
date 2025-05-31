import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [ProxyRMQModule, AuthModule],
  controllers: [CategoryController]
})
export class CategoryModule {}
