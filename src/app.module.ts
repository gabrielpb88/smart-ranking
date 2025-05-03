import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), CategoryModule, ProxyRMQModule]
})
export class AppModule {}
