import { Injectable, Logger } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player } from './interface/player.interface';

@Injectable()
export class PlayerService {

  private readonly logger = new Logger(PlayerService.name);

  constructor(@InjectModel('Player') private readonly playerModel: Model<Player>) {}

  async create(createPlayerDto: CreatePlayerDto): Promise<void> {
    try {
      const newPlayer = await this.playerModel.create(createPlayerDto);
      await newPlayer.save();
    }
    catch (error) {
      this.logger.error(`Error creating player: ${JSON.stringify(error.message)}`);
      throw new Error('Error creating player');
    }
  }
}
