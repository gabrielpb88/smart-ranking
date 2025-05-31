import { Module } from '@nestjs/common';
import { ClientProxySmartRanking } from './client-proxy';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    providers: [ClientProxySmartRanking],
    exports: [ClientProxySmartRanking]
})
export class ProxyRMQModule {}
