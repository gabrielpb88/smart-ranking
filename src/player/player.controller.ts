import { BadRequestException, Body, Controller, Logger, Get, Post, Query, UsePipes, ValidationPipe, Delete, Put, Param } from '@nestjs/common';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Controller('api/v1/player')
export class PlayerController {

    private logger = new Logger(PlayerController.name);
    private clientProxy

    constructor(private readonly clientProxySmartRanking: ClientProxySmartRanking) {
        this.clientProxy = this.clientProxySmartRanking.getClientProxyAdminBackendInstance()
    }

    @Post()
    @UsePipes(ValidationPipe)
    async createPlayer(@Body() createPlayerDto: CreatePlayerDto) {
        try {
            await this.clientProxy.send('find-category', createPlayerDto.category).toPromise()
        } catch (error) {
            this.logger.error(`Error creating player: ${JSON.stringify(error)}`);
            throw new BadRequestException('Category not found');
        }
        await this.clientProxy.emit('create-player', createPlayerDto)
    }

    @Get()
    async findPlayers(@Query('_id') _id: string) {
        try {
            const res = await this.clientProxy.send('find-player', _id ? _id : '').toPromise()
            return res
        } catch (error) {
            this.logger.error(`Error finding player: ${JSON.stringify(error)}`);
            throw new BadRequestException(error.message);
        }
    }

    @Put('/:_id')
    @UsePipes(ValidationPipe)
    async updatePlayer(@Param('_id') _id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
        const category = await this.clientProxy.send('find-category', updatePlayerDto.category).toPromise()
        if(category) {
            await this.clientProxy.send('update-player', { id: _id, player: updatePlayerDto })
        } else {
            throw new BadRequestException('Category not found');
        }
    }

    @Delete('/:_id')
    async deletePlayers(@Param('_id') _id: string) {
        await this.clientProxy.emit('delete-player', _id)
    }
}
