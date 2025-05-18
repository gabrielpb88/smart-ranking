import { Test, TestingModule } from '@nestjs/testing';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Category } from 'src/category/interface/category.interface';
import { RpcException } from '@nestjs/microservices';

describe('PlayerService', () => {
  let service: PlayerService;
  let playerModelMock: any;
  let categoryModelMock: any;

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

  it('should throw if category id is invalid', async () => {
    const createPlayerDto: CreatePlayerDto = { 
      category: { _id: 'invalid_id' } as unknown as Category,
    } as unknown as CreatePlayerDto;

    await expect(service.create(createPlayerDto))
    .rejects.toThrow(`Invalid category id: ${createPlayerDto.category._id}`)
    expect(playerModelMock.create).not.toHaveBeenCalled();
  })

  it('should throw if category does not exist', async () => {
    const createPlayerDto: CreatePlayerDto = {
      category: { _id: '64a7b3d1f3e2b45a9c1e72d8' } as unknown as Category,
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
      category: { _id: '64a7b3d1f3e2b45a9c1e72d8' } as unknown as Category,
    } as unknown as CreatePlayerDto;
    categoryModelMock.findById.mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue({ _id: createPlayerDto.category._id })
    })

    playerModelMock.create = jest.fn().mockRejectedValue(new Error('Error message'))

    await expect(service.create(createPlayerDto))
    .rejects.toThrow('Error message')
  });

  it('should create a player if the category exists', async () => {
    const validCategoryId = '64a7b3d1f3e2b45a9c1e72d8';
    const anyId = 'anyId';
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

    playerModelMock.create.mockResolvedValue({ _id: anyId, ...createPlayerDto })

    const result = await service.create(createPlayerDto);

    expect(result).toBeDefined();
    expect(playerModelMock.create).toHaveBeenCalledWith(createPlayerDto);
    expect(result).toEqual({ _id: anyId, ...createPlayerDto})
  });
});
