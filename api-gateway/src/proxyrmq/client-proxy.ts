import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class ClientProxySmartRanking {

  constructor(
    private readonly configService: ConfigService
  ) {}

    getClientProxyAdminBackendInstance(): ClientProxy {
        const HABBITMQ_USER = this.configService.get<string>('RABBITMQ_USER')
        const HABBITMQ_PASSWORD = this.configService.get<string>('RABBITMQ_PASSWORD')
        const HABBITMQ_URL = this.configService.get<string>('RABBITMQ_URL')

        return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [`amqp://${HABBITMQ_USER}:${HABBITMQ_PASSWORD}@${HABBITMQ_URL}`],
                queue: 'admin-backend'
            }
        })
    }
}
