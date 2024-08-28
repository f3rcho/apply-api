import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from '../service/products.service';
import { CreateProductDto, FilterProductDto } from '../dto/product.dto';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    fetchProducts: jest.fn(),
    findAll: jest.fn(),
    createProduct: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('fetchAll', () => {
    it('should call service.fetchProducts and return the result', async () => {
      const result = [{ name: 'Product 1' }];
      mockProductsService.fetchProducts.mockResolvedValue(result);

      expect(await controller.fetchAll()).toEqual(result);
      expect(service.fetchProducts).toHaveBeenCalledTimes(1);
    });
  });

  describe('getProducts', () => {
    it('should call service.findAll with the correct params', () => {
      const params: FilterProductDto = {
        limit: 10,
        offset: 0,
        minPrice: 100,
        maxPrice: 500,
        name: 'Product Name',
        category: 'Category',
      };

      const result = [{ name: 'Product 1', price: 150 }];
      mockProductsService.findAll.mockReturnValue(result);

      expect(controller.getProducts(params)).toEqual(result);
      expect(service.findAll).toHaveBeenCalledWith(params);
    });
  });

  describe('deleteProductById', () => {
    it('should call service.remove with the correct id', async () => {
      const id = 1;
      const result = { id, status: false };

      mockProductsService.remove.mockResolvedValue(result);

      expect(await controller.deleteProductById(id)).toEqual(result);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
