import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../products/models/product';
import { Repository } from 'typeorm';
import { ReportsDto, GenerateReport } from './reports.dto';

describe('ReportsService', () => {
  let service: ReportsService;
  let productRepository: Repository<Product>;

  const mockProductRepository = {
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the percentage of deleted products', async () => {
    mockProductRepository.count.mockResolvedValueOnce(100);
    mockProductRepository.count.mockResolvedValueOnce(20);

    const result = await service.getDeletedProductPercentage();
    expect(result).toBe(20);
    expect(mockProductRepository.count).toHaveBeenCalledTimes(2);
  });

  it('should return the percentage of non-deleted products', async () => {
    const payload: ReportsDto = {
      init: new Date('2023-01-01'),
      end: new Date('2023-12-31'),
      hasPrice: true,
    };

    mockProductRepository.count.mockResolvedValueOnce(100);
    mockProductRepository.count.mockResolvedValueOnce(70);

    const result = await service.getNonDeletedProductsPercentage(payload);
    expect(result).toBe(70);
  });

  it('should return the count of products by category when active', async () => {
    mockProductRepository.count.mockResolvedValueOnce(50);

    const result = await service.getProductsCountByCategoryActive(
      'electronics',
    );
    expect(result).toBe(50);
  });

  it('should generate a report with the correct percentages', async () => {
    const payload: GenerateReport = {
      init: new Date('2023-01-01'),
      end: new Date('2023-12-31'),
      category: 'electronics',
      hasPrice: true,
    };

    mockProductRepository.count.mockResolvedValueOnce(100);
    mockProductRepository.count.mockResolvedValueOnce(20);
    mockProductRepository.count.mockResolvedValueOnce(70);
    mockProductRepository.count.mockResolvedValueOnce(50);

    const result = await service.generateReport(payload);

    expect(result.deletedProductPercentage).toBe(20);
    expect(result.getNonDeletedProductsPercentage).toBe(70);
    expect(result.productsByCategory).toBe(50);
  });
});
