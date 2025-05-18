import { Test, TestingModule } from '@nestjs/testing';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Category } from 'src/category/interface/category.interface';
import { RpcException } from '@nestjs/microservices';
import { Player } from './interface/player.interface';

describe('PlayerService', () => {
  let service: PlayerService;
  let playerModelMock: any;
  let categoryModelMock: any;
  let validCategoryId = '64a7b3d1f3e2b45a9c1e72d8';
  let validId = '64a7b3d1f3e2b45a9c1e72d8';
  let invalidId = 'invalidId';

  beforeEach(async () => {
    playerModelMock = {
      create: jest.fn(),
      save: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findById: jest.fn(),
      find: jest.fn(),
      deleteOne: jest.fn(),
    }

    categoryModelMock = {
      findById: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerService,
        { provide: 'PlayerModel', useValue: playerModelMock },
        { provide: 'CategoryModel', useValue: categoryModelMock },
      ],
    }).compile();

    service = module.get<PlayerService>(PlayerService);
  });

  describe('create', () => {
    it('should throw if category id is invalid', async () => {
      const createPlayerDto: CreatePlayerDto = { 
        category: { _id: invalidId } as unknown as Category,
      } as unknown as CreatePlayerDto;
  
      await expect(service.create(createPlayerDto))
      .rejects.toThrow(`Invalid category id: ${createPlayerDto.category._id}`)
      expect(playerModelMock.create).not.toHaveBeenCalled();
    })
  
    it('should throw if category does not exist', async () => {
      const createPlayerDto: CreatePlayerDto = {
        category: { _id: validCategoryId } as unknown as Category,
      } as unknown as CreatePlayerDto;
      categoryModelMock.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null)
      })
  
      await expect(service.create(createPlayerDto))
      .rejects.toThrow(`Category with id ${createPlayerDto.category._id} not found`)
      expect(playerModelMock.create).not.toHaveBeenCalled();
    });
  
    it('should throw if create player throws', async () => {
      const createPlayerDto: CreatePlayerDto = {
        category: { _id: validCategoryId } as unknown as Category,
      } as unknown as CreatePlayerDto;
      categoryModelMock.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue({ _id: createPlayerDto.category._id })
      })
  
      playerModelMock.create = jest.fn().mockRejectedValue(new Error('Error message'))
  
      await expect(service.create(createPlayerDto))
      .rejects.toThrow(new Error('Error message'))
    });
  
    it('should create a player if the category exists', async () => {
      const createPlayerDto: CreatePlayerDto = {
        name: 'Any Name',
        category: { _id: validCategoryId } as unknown as Category,
        email: 'valid@email.com',
        phoneNumber: '1234567890',
        ranking: 'A',
        rankingPosition: 1,
        urlPlayerPicture: 'http://valid-url.com/picture.jpg'
       };
  
      categoryModelMock.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue({ _id: validCategoryId }),
      });
      
      playerModelMock.create.mockResolvedValue({ _id: validId, ...createPlayerDto })
  
      const result = await service.create(createPlayerDto);
  
      expect(result).toBeDefined();
      expect(playerModelMock.create).toHaveBeenCalledWith(createPlayerDto);
      expect(result).toEqual({ _id: validId, ...createPlayerDto})
    });
  })

  describe('updatePlayer', () => {
    it('should throw if category id is invalid', async () => {
      await expect(service.updatePlayer(invalidId, {} as unknown as Player))
      .rejects.toThrow(new RpcException(`Invalid Id: ${invalidId}`));
      expect(playerModelMock.findByIdAndUpdate).not.toHaveBeenCalled();
    })
  
    it('should throw if categoryModel.findById throws', async () => {
      categoryModelMock.findById.mockReturnValueOnce({
        exec: jest.fn().mockRejectedValue(new Error('Error message')),
      })
  
      await expect(service.updatePlayer(validId, { category: { _id: validId }} as unknown as Player))
      .rejects.toThrow(new RpcException(`Error message`));
      expect(playerModelMock.findByIdAndUpdate).not.toHaveBeenCalled();
    })
  
    it('should throw if findByIdAndUpdate throws', async () => {
      categoryModelMock.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue({ _id: validCategoryId }),
      })

      playerModelMock.findByIdAndUpdate.mockReturnValueOnce({
        exec: jest.fn().mockRejectedValue(new Error('Error message')),
      })
  
      await expect(service.updatePlayer(validId, { category: { _id: validCategoryId }} as unknown as Player))
      .rejects.toThrow(new RpcException(`Error message`));
      expect(playerModelMock.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(playerModelMock.findByIdAndUpdate).toHaveBeenCalledWith(
        { _id: validId }, { $set: { category: { _id: validCategoryId } } }
      );
    })

    it('should update player with correct data', async () => {
      categoryModelMock.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue({ _id: validCategoryId }),
      })

      playerModelMock.findByIdAndUpdate.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue({ _id: validId }),
      })

      const validPlayer = { category: { _id: validCategoryId }} as unknown as Player

      const updatedPlayer = await service.updatePlayer(validId, validPlayer)
      expect(updatedPlayer).toBeDefined();
      expect(playerModelMock.findByIdAndUpdate).toHaveBeenCalledTimes(1);  
      expect(playerModelMock.findByIdAndUpdate).toHaveBeenCalledWith(
        { _id: validId }, { $set: validPlayer });
      expect(updatedPlayer).toEqual({ _id: validId });
    })
  })

  describe('findPlayerById', () => {
    it('should throw if id is invalid', async () => {
      await expect(service.findPlayerById(invalidId))
      .rejects.toThrow(new RpcException(`Invalid Player Id: ${invalidId}`));
      expect(playerModelMock.findById).not.toHaveBeenCalled();
    })

    it('should throw if findById throws', async () => {
      playerModelMock.findById.mockReturnValueOnce({
        exec: jest.fn().mockRejectedValue(new Error('Error message')),
      })

      await expect(service.findPlayerById(validId))
      .rejects.toThrow(new RpcException(`Error message`));
      expect(playerModelMock.findById).toHaveBeenCalledTimes(1);
      expect(playerModelMock.findById).toHaveBeenCalledWith(validId);
    })

    it('should return player if found', async () => {
      const mockPlayer: Player = { _id: validId, name: 'Player 1' } as unknown as Player;
      playerModelMock.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(mockPlayer),
      });

      const result = await service.findPlayerById(validId);
      expect(result).toEqual(mockPlayer);
      expect(playerModelMock.findById).toHaveBeenCalledTimes(1);
      expect(playerModelMock.findById).toHaveBeenCalledWith(validId);
    })
  })

  describe('findAllPlayers', () => {
    it('should throw if find throws', async () => {
      playerModelMock.find.mockReturnValueOnce({
        exec: jest.fn().mockRejectedValue(new Error('Error message')),
      })

      await expect(service.findAllPlayers())
      .rejects.toThrow(new RpcException(`Error message`));
      expect(playerModelMock.find).toHaveBeenCalledTimes(1);
    })

    it('should return all players', async () => {
      const mockPlayers: Player[] = [
        { _id: '1', name: 'Player 1' } as unknown as Player,
        { _id: '2', name: 'Player 2' } as unknown as Player,
      ];
      playerModelMock.find.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(mockPlayers),
      });

      const result = await service.findAllPlayers();
      expect(result).toEqual(mockPlayers);
      expect(playerModelMock.find).toHaveBeenCalledTimes(1);
    })
  })
  
  describe('deletePlayer', () => {

    it('should throw if id is invalid', async () => {
      await expect(service.deletePlayer(invalidId))
      .rejects.toThrow(new RpcException(`Invalid Id Format: ${invalidId}`));
      expect(playerModelMock.deleteOne).not.toHaveBeenCalled();
    })

    it('should throw if deleteOne throws', async () => {
      playerModelMock.deleteOne.mockReturnValueOnce({ 
        exec: jest.fn().mockResolvedValue({deletedCount: 0 })
      });

      await expect(service.deletePlayer(validId))
      .rejects.toThrow(new RpcException(`Failed to delete player with id: ${validId}`));
      expect(playerModelMock.deleteOne).toHaveBeenCalledTimes(1);
    })

    it('should delete player if found', async () => {
      playerModelMock.deleteOne.mockReturnValueOnce({ 
        exec: jest.fn().mockResolvedValue({ deletedCount: 1 })
      });

      const result = await service.deletePlayer(validId);
      expect(result).toBe(1);
      expect(playerModelMock.deleteOne).toHaveBeenCalledTimes(1);
      expect(playerModelMock.deleteOne).toHaveBeenCalledWith({ _id: validId });
    })
  })
});
