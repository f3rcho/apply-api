import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { GenerateReport, ReportsDto } from './reports.dto';
import { ApiKeyGuard } from './reports.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Reports module')
@Controller('reports')
@UseGuards(ApiKeyGuard)
export class ReportsController {
  constructor(private service: ReportsService) {}

  @Get('/deleted-percentage')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get deleted products per percentage',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Data Undefined!',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
  })
  @HttpCode(HttpStatus.OK)
  getDeletedProductPercentage() {
    return this.service.getDeletedProductPercentage();
  }

  @Get('/non-deleted-percentage')
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Get non deleted products per percentage, price and date range',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Data Undefined!',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
  })
  @HttpCode(HttpStatus.OK)
  getNonDeletedProductsPercentage(@Query() payload: ReportsDto) {
    return this.service.getNonDeletedProductsPercentage(payload);
  }

  @Get('/products-by-category')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get products count by category',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Data Undefined!',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
  })
  @HttpCode(HttpStatus.OK)
  getProductsCountByCategory(@Query() category: Record<string, string>) {
    return this.service.getProductsCountByCategoryActive(category.category);
  }

  @Get('/generate-report')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Generate total report, range date, category and price',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Data Undefined!',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
  })
  @HttpCode(HttpStatus.OK)
  generateReport(
    @Query()
    { init, end, category, hasPrice }: GenerateReport,
  ) {
    return this.service.generateReport({ init, end, category, hasPrice });
  }
}
