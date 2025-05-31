import { Test, TestingModule } from "@nestjs/testing";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { RmqContext, RpcException } from "@nestjs/microservices";
import { UpdateCategoryDto } from "./dto/update-category.dto";

describe('CategoryController', () => {
  let controller: CategoryController;
  let categoryServiceMock: any;
  let ctxMock
  const ackMock = jest.fn();
  const nackMock = jest.fn();

  beforeEach(async () => {
    categoryServiceMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      updateCategory: jest.fn(),
    }

    ctxMock = {
      getChannelRef: () => ({
        ack: ackMock,
        nack: nackMock,
    }),
    getMessage: () => ({}),
    } as unknown as RmqContext;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        { provide: CategoryService, useValue: categoryServiceMock },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
  });

  describe('create', () => {
      it('should nack the message when an error occurs', async () => {
        const createCategoryDto: CreateCategoryDto = {} as unknown as CreateCategoryDto
        categoryServiceMock.create.mockRejectedValue(RpcException)

        await expect(controller.create(createCategoryDto, ctxMock)).rejects.toThrow(RpcException);

        expect(ctxMock.getChannelRef().nack).toHaveBeenCalled()
      })

      it('should create a category when correct data is provided', async () => {
        const createCategoryDto: CreateCategoryDto = {
            category: 'Any Category',
            description: 'Any Description',
            events: []
        };
        await controller.create(createCategoryDto, ctxMock)

        expect(categoryServiceMock.create).toHaveBeenCalledWith(createCategoryDto);
        expect(ctxMock.getChannelRef().ack).toHaveBeenCalledTimes(1);
      });
    })

    describe('find', () => {
      it('should nack the message when find throws an error', async () => {
        categoryServiceMock.findById.mockRejectedValue(RpcException)

        await expect(controller.find('64a7b3d1f3e2b45a9c1e72d8', ctxMock)).rejects.toThrow(RpcException)
        expect(nackMock).toHaveBeenCalled()
      })

      it('should nack the message when find throws an error', async () => {
        categoryServiceMock.findAll.mockRejectedValue(RpcException)

        await expect(controller.find(null, ctxMock)).rejects.toThrow(RpcException)
        expect(nackMock).toHaveBeenCalled()
      })

      it('should ack the message when find succeed', async () => {
        categoryServiceMock.findAll.mockResolvedValue([{ _id: '64a7b3d1f3e2b45a9c1e72d8' }])

        const result = await controller.find(null, ctxMock)

        expect(result).toEqual([{ _id: '64a7b3d1f3e2b45a9c1e72d8' }])
        expect(ackMock).toHaveBeenCalled()
      })
    })

    describe('updateCategory', () => {
      it('should nack the message when updateCategory service throws an error', async () => {
        categoryServiceMock.updateCategory.mockRejectedValue(RpcException)

        await expect(controller.updateCategory({} as unknown as UpdateCategoryDto, ctxMock)).rejects.toThrow(RpcException)
        expect(nackMock).toHaveBeenCalled()
      })

      it('should ack the message when update succeeds', async () => {
        const updateDto: UpdateCategoryDto = {
            _id: '64a7b3d1f3e2b45a9c1e72d8',
            category: 'Any Category'
        }
        categoryServiceMock.updateCategory.mockResolvedValue(updateDto)
        const result = await controller.updateCategory(updateDto, ctxMock)

        expect(result).toEqual(updateDto)
        expect(ackMock).toHaveBeenCalled()
      })
    })
});