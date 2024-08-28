import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ProductsService } from '../service/products.service';
import { FilterProductDto } from '../dto/product.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Product } from '../models/product';

@ApiTags('Products module')
@Controller('products')
export class ProductsController {
  private logger = new Logger(ProductsController.name);
  constructor(private service: ProductsService) {}

  @Get('/fetch-all')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Fetch all products',
    type: [Product],
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
  async fetchAll() {
    this.logger.log(`[fetchAll] executed`);
    return await this.service.fetchProducts();
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get paginated products by filters',
    type: [Product],
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
  getProducts(@Query() params: FilterProductDto) {
    this.logger.log(`[getProducts] req: ${JSON.stringify(params)}`);
    return this.service.findAll(params);
  }

  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete products by Id',
    type: [Product],
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
  deleteProductById(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`[deleteProductById] req: ${id}`);
    return this.service.remove(id);
  }
}
