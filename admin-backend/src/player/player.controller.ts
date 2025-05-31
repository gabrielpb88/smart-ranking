import { BadRequestException, Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext, MessagePattern, RpcException } from '@nestjs/microservices';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Player } from './interface/player.interface';

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

  @EventPattern('update-player')
  async updatePlayer(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef()
    const originalMsg = context.getMessage()

    try {
      const _id: string = data.id
      const player: Player = data.player
      await this.playerService.updatePlayer(_id, player);
      await channel.ack(originalMsg)
    } catch (error) { 
      this.logger.error(`error: ${JSON.stringify(error)}`)
      await channel.nack(originalMsg, false, false)
    }
  }

  @MessagePattern('find-player')
  async findPlayers(@Payload() _id: string, @Ctx() context: RmqContext): Promise<Player[] | Player | null> {
    const channel = context.getChannelRef()
    const originalMsg = context.getMessage()

    let result
    try {
      if(_id) {
        result = await this.playerService.findPlayerById(_id);
      } else {
        result = await this.playerService.findAllPlayers();
      }
      await channel.ack(originalMsg)
      return result;
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error)}`)
      await channel.nack(originalMsg, false, false)
      return null
    }
  }

  @EventPattern('delete-player')
  async deletePlayer(@Payload() _id: string, @Ctx() context: RmqContext): Promise<void> {
    const channel = context.getChannelRef()
    const originalMsg = context.getMessage()

    try {
      await this.playerService.deletePlayer(_id)
      await channel.ack(originalMsg)
    } catch (error) {
      this.logger.error(`Error deleting player with id: ${_id}`)
      await channel.nack(originalMsg, false, false)
      throw new RpcException(error.message)
    }
  }
}
