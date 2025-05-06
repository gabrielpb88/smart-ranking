import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';

@Module({
  imports: [ProxyRMQModule],
  controllers: [PlayerController]
})
export class PlayerModule {}
