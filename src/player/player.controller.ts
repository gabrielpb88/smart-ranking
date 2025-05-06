import { BadRequestException, Body, Controller, Logger, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Category } from '../category/interface/category.interface';

@Controller('api/v1/player')
export class PlayerController {

    private logger = new Logger(PlayerController.name);
    private clientProxy

    constructor(private readonly clientProxySmartRanking: ClientProxySmartRanking) {
        this.clientProxy = clientProxySmartRanking.getClientProxyAdminBackendInstance()
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
}
