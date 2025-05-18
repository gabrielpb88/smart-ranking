import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player } from './interface/player.interface';
import { RpcException } from '@nestjs/microservices';
import { isMongoId } from 'class-validator';
import { Category } from 'src/category/interface/category.interface';

@Injectable()
export class PlayerService {
  
  private readonly logger = new Logger(PlayerService.name);

  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
    @InjectModel('Category') private readonly categoryModel: Model<Category>
  ) {}

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    if(!isMongoId(createPlayerDto.category._id)){
      const errorMessage = `Invalid category id: ${createPlayerDto.category._id}`
      this.logger.error(errorMessage);
      throw new RpcException(errorMessage)
    } 
    
    let categoryId
    try {
      categoryId = await this.categoryModel.findById(createPlayerDto.category._id).exec()
    } catch (error) {
      this.logger.error(`Error finding category: ${JSON.stringify(error.message)}`)
      throw new RpcException(error.message)
    }
    
    if(!categoryId) {
      const errorMessage = `Category with id ${createPlayerDto.category._id} not found`
      this.logger.error(errorMessage);
      throw new RpcException(errorMessage)
    } else {
      try {
        return await this.playerModel.create(createPlayerDto);
      } catch (error) {
        this.logger.error(`Error creating player: ${JSON.stringify(error.message)}`)
        throw new RpcException(error.message)
      }
    }
  }

  async updatePlayer(_id: string, player: Player): Promise<Player | null> {
    try {
      if(!isMongoId(_id)) {
        throw new RpcException(`Invalid Id`)
      }
      const updatedPlayer = await this.playerModel.findByIdAndUpdate({ _id }, { $set: player }).exec()    
      return updatedPlayer
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
      throw new RpcException(`Failed to delete player with id: ${_id}`)
    }
  }
}
