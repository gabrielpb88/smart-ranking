import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './interface/category.interface';
import { RpcException } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryModelMock: any;
  let validId = '64a7b3d1f3e2b45a9c1e72d8';

  beforeEach(async () => {
    categoryModelMock = {
      create: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findOneAndUpdate: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryService,
        { provide: 'CategoryModel', useValue: categoryModelMock },
        
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  describe('create', () => {
    it('should throw an error if creation fails', async () => {
      const errorMessage = 'Error creating category';
      categoryModelMock.create.mockRejectedValue(new Error(errorMessage));

      await expect(service.create({} as unknown as CreateCategoryDto)).rejects.toThrow(errorMessage);
    });

    it('should create a category successfully', async () => {
      const createCategoryDto: CreateCategoryDto = {
        category: 'Any Category',
        description: 'Any Description',
        events: []
      }
      categoryModelMock.create.mockResolvedValue({ _id: validId, ...createCategoryDto });

      const result = await service.create(createCategoryDto);

      expect(result).toBeDefined()
      expect(result).toEqual({ _id: validId, ...createCategoryDto });
      expect(categoryModelMock.create).toHaveBeenCalledTimes(1);
      expect(categoryModelMock.create).toHaveBeenCalledWith(createCategoryDto);
    });
  })

  describe('findAll', () => {
    it('should throw an error if fetching categories fails', async () => {
      const errorMessage = 'Error fetching categories';
      categoryModelMock.find.mockReturnValue({
        exec: jest.fn().mockRejectedValue(new RpcException(errorMessage)),
      });

      await expect(service.findAll()).rejects.toThrow(errorMessage);    
    })

    it('should return an array of categories', async () => {
      const categories: Category[] = [
        { _id: validId, category: 'Category 1', description: 'Description 1' },
        { _id: '64a7b3d1f3e2b45a9c1e72d9', category: 'Category 2', description: 'Description 2' },
      ] as unknown as Category[];

      categoryModelMock.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(categories),
      });

      const result = await service.findAll();

      expect(result).toEqual(categories);
      expect(categoryModelMock.find).toHaveBeenCalledTimes(1);
    });
  })
});
