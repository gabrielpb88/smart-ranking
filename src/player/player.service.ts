import { Injectable, Logger } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player } from './interface/player.interface';
import { RpcException } from '@nestjs/microservices';
import { isMongoId, validate } from 'class-validator';

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
      throw new RpcException('Error creating player');
    }
  }

  async updatePlayer(_id: string, player: Player): Promise<void> {
    try {
      if(!isMongoId(_id)) {
        throw new RpcException(`Invalid Id`)
      }
      await this.playerModel.findByIdAndUpdate({ _id }, { $set: player }).exec()    
    } catch (error) {
      this.logger.error(`Error updating player: ${JSON.stringify(error.message)}`)
      throw new RpcException(error.message)
    }
  }

  async findPlayerById(_id: string): Promise<Player | null | undefined> {
    if(!isMongoId(_id)) {
      return null
    }
    try {
      return this.playerModel.findById(_id).exec()
    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`)
    }
  }

  async findAllPlayers(): Promise<Player[]> {
    try {
      return this.playerModel.find().exec()
    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`)
      return []
    }
  }

  async deletePlayer(_id: string): Promise<void> {
    const deleteResult = await this.playerModel.deleteOne({ _id }).exec()
    if(deleteResult.deletedCount != 1) {
      throw new Error(`Failed to delete player with id: ${_id}`)
    }
  }
}
