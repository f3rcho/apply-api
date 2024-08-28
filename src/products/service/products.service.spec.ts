import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Product } from '../models/product';
import { of, throwError } from 'rxjs';
import { Repository } from 'typeorm';
import { AxiosResponse } from 'axios';

const mockProductRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  merge: jest.fn(),
};

const mockHttpService = {
  get: jest.fn(),
};

const mockConfigService = {
  get: jest.fn().mockReturnValue({
    baseUrl: 'https://api.contentful.com',
    accessToken: 'someToken',
    environment: 'someEnvironment',
    contentType: 'product',
    spaceId: 'someSpaceId',
  }),
};

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchProducts', () => {
    it('should fetch products and call batchProducts', async () => {
      const mockResponse: AxiosResponse<any> = {
        data: {
          items: [
            { fields: { sku: '001', name: 'Product 1', price: 100 } },
            { fields: { sku: '002', name: 'Product 2', price: 200 } },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined,
        },
      };

      jest.spyOn(mockHttpService, 'get').mockReturnValue(of(mockResponse));

      const batchProductsSpy = jest.spyOn(service, 'batchProducts');

      await service.fetchProducts();

      expect(mockHttpService.get).toHaveBeenCalled();
      expect(batchProductsSpy).toHaveBeenCalledWith([
        { sku: '001', name: 'Product 1', price: 100 },
        { sku: '002', name: 'Product 2', price: 200 },
      ]);
    });

    it('should log an error and throw an HttpException on Axios error', async () => {
      const errorMessage = 'Some error';
      jest.spyOn(mockHttpService, 'get').mockReturnValue(
        throwError(() => ({
          response: { data: null },
          message: errorMessage,
        })),
      );

      try {
        await service.fetchProducts();
      } catch (error) {
        expect(error.message).toBe(errorMessage);
      }
    });
  });

  describe('batchProducts', () => {
    it('should create new products and update existing ones', async () => {
      const mockProducts = [
        {
          sku: '001',
          name: 'Product 1',
          price: 100,
          id: 1,
          brand: 'test',
          model: '1',
          category: '1',
          color: 'blue',
          currency: 'USD',
          stock: 1,
        },
        {
          sku: '002',
          name: 'Product 2',
          price: 200,
          id: 1,
          brand: 'test',
          model: '1',
          category: '1',
          color: 'blue',
          currency: 'USD',
          stock: 1,
        },
      ];
      const result = {
        sku: '002',
        name: 'Old Product 2',
        price: 150,
        id: 1,
        brand: 'test',
        model: '1',
        category: '1',
        status: true,
        color: 'blue',
        currency: 'USD',
        stock: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(result);

      await service.batchProducts(mockProducts);

      expect(productRepository.create).toHaveBeenCalledWith({
        ...mockProducts[0],
        status: true,
      });

      expect(productRepository.merge).toHaveBeenCalledWith(
        result,
        mockProducts[1],
      );
    });
  });
});
