import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ProxyRMQModule, AuthModule, ConfigModule],
  controllers: [PlayerController]
})
export class PlayerModule {}
