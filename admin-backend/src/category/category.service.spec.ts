import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './interface/category.interface';
import { RpcException } from '@nestjs/microservices';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryModelMock: any;
  let validId = '64a7b3d1f3e2b45a9c1e72d8';

  beforeEach(async () => {
    categoryModelMock = {
      create: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
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

  describe('findById', () => {
    it('should throw an error if fetching category by ID fails', async () => {
      const errorMessage = 'Error fetching category by ID';
      categoryModelMock.findById.mockRejectedValue(new RpcException(errorMessage));

      await expect(service.findById(validId)).rejects.toThrow(new RpcException(errorMessage));
    });

    it('should return a category by ID when ID is valid and found', async () => {
      const category: Category = { _id: validId, category: 'Category 1', description: 'Description 1', events: [] } as unknown as Category;

      categoryModelMock.findById.mockResolvedValue(category);

      const result = await service.findById(validId);

      expect(result).toEqual(category);
      expect(categoryModelMock.findById).toHaveBeenCalledWith(validId);
      expect(categoryModelMock.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateCategory', () => {
    it('should throw an error if updating category throws', async () => {
      const errorMessage = 'Error updating category';
      categoryModelMock.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockRejectedValue(new RpcException(errorMessage)),
      });

      await expect(service.updateCategory({} as unknown as UpdateCategoryDto)).rejects.toThrow(new RpcException(errorMessage));
    });

    it('should update a category successfully', async () => {
      const category = { _id: validId, category: 'Category 1', description: 'Description 1', events: [] };
      categoryModelMock.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(true),
      });

      await service.updateCategory(category);

      expect(categoryModelMock.findByIdAndUpdate).toHaveBeenCalledWith({ _id: validId }, { $set: category });
      expect(categoryModelMock.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    });
  })
});
