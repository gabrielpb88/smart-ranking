import { Module } from '@nestjs/common';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), ProxyRMQModule]
})
export class AppModule {}
