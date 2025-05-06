import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';

@Controller()
export class PlayerController {

  private readonly logger = new Logger(PlayerController.name);

  constructor(private readonly playerService: PlayerService) {}

  @EventPattern('create-player')
  async create(@Payload() createPlayerDto: CreatePlayerDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef()
    const originalMsg = context.getMessage()

    try {
      await this.playerService.create(createPlayerDto);
      channel.ack(originalMsg)
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error)}`)
      channel.nack(originalMsg, false, false)
    }

  }
}
