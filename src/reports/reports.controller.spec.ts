import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ApiKeyGuard } from './reports.guard';
import { ReportsDto, GenerateReport } from './reports.dto';

describe('ReportsController', () => {
  let controller: ReportsController;
  let service: ReportsService;

  const mockReportsService = {
    getDeletedProductPercentage: jest.fn(() => 'deletedPercentage'),
    getNonDeletedProductsPercentage: jest.fn(() => 'nonDeletedPercentage'),
    getProductsCountByCategoryActive: jest.fn(() => 'productsByCategory'),
    generateReport: jest.fn(() => 'generatedReport'),
  };

  const mockApiKeyGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: mockReportsService,
        },
      ],
    })
      .overrideGuard(ApiKeyGuard)
      .useValue(mockApiKeyGuard)
      .compile();

    controller = module.get<ReportsController>(ReportsController);
    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return deleted product percentage', () => {
    const result = controller.getDeletedProductPercentage();
    expect(result).toBe('deletedPercentage');
    expect(service.getDeletedProductPercentage).toHaveBeenCalled();
  });

  it('should return non-deleted products percentage', () => {
    const dto: ReportsDto = {
      hasPrice: true,
      init: undefined,
      end: undefined,
    };
    const result = controller.getNonDeletedProductsPercentage(dto);
    expect(result).toBe('nonDeletedPercentage');
    expect(service.getNonDeletedProductsPercentage).toHaveBeenCalledWith(dto);
  });

  it('should return products count by category', () => {
    const category = { category: 'electronics' };
    const result = controller.getProductsCountByCategory(category);
    expect(result).toBe('productsByCategory');
    expect(service.getProductsCountByCategoryActive).toHaveBeenCalledWith(
      category.category,
    );
  });

  it('should generate report', () => {
    const reportParams: GenerateReport = {
      init: new Date('2023-01-01'),
      end: new Date('2023-12-31'),
      category: 'electronics',
      hasPrice: true,
    };
    const result = controller.generateReport(reportParams);
    expect(result).toBe('generatedReport');
    expect(service.generateReport).toHaveBeenCalledWith(reportParams);
  });
});
