import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';
import { ConfigModule } from '@nestjs/config';
import { PlayerModule } from './player/player.module';

@Module({
  imports: [ConfigModule.forRoot(), CategoryModule, ProxyRMQModule, PlayerModule]
})
export class AppModule {}
