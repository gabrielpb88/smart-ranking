import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayerSchema } from './entities/player.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Player', schema: PlayerSchema }])],
  controllers: [PlayerController],
  providers: [PlayerService],
})
export class PlayerModule {}
