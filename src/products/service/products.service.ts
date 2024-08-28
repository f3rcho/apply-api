import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Repository, Between } from 'typeorm';
import { Product } from '../models/product';
import { ContentfulResponse, Fields } from '../models/response';
import { CreateProductDto, FilterProductDto } from 'products/dto/product.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private http: HttpService,
    private configService: ConfigService,
  ) {}
  private readonly logger = new Logger(ProductsService.name);

  @Cron(CronExpression.EVERY_HOUR, { name: 'batchProducts' })
  async fetchProducts(): Promise<Fields[]> {
    this.logger.log('[fetchProducts] executing fetch all to contentful');
    const { baseUrl, accessToken, environment, contentType, spaceId } =
      this.configService.get('config.contentful');
    const URL = `${baseUrl}/${spaceId}/environments/${environment}/entries?access_token=${accessToken}&content_type=${contentType}`;

    const { data } = await firstValueFrom(
      this.http.get<ContentfulResponse>(URL).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(`[batchProducts] error`);
          throw new HttpException(error.message, error.status);
        }),
      ),
    );

    const products = data.items.map((i) => i.fields);
    return this.batchProducts(products);
  }

  findAll(params: FilterProductDto) {
    if (params) {
      const { limit, offset } = params;
      const { minPrice, maxPrice } = params;
      const { name, category } = params;
      const where = {
        status: true,
      };

      if (minPrice && maxPrice) {
        where['price'] = Between(minPrice, maxPrice);
      }
      if (name) {
        where['name'] = name;
      }
      if (category) {
        where['category'] = category;
      }
      return this.productRepository.find({
        where,
        take: limit,
        skip: offset,
        order: {
          price: 'ASC',
        },
      });
    }
    return this.productRepository.find({
      take: 5,
      skip: 0,
    });
  }

  async remove(productId: number) {
    const deletedProduct = await this.productRepository.findOneBy({
      id: productId,
    });

    const product = this.productRepository.merge({
      ...deletedProduct,
      status: false,
    });
    return await this.productRepository.save(product);
  }

  async createProduct(payload: CreateProductDto): Promise<Product> {
    const newProduct = this.productRepository.create(payload);
    return this.productRepository.save(newProduct);
  }

  async batchProducts(payload: CreateProductDto[]): Promise<Product[]> {
    const upsertedProduct: Product[] = [];

    for (const productData of payload) {
      let product = await this.productRepository.findOne({
        where: {
          sku: productData.sku,
        },
      });

      if (product) {
        if (product.status === true) {
          product = this.productRepository.merge(product, productData);
        }
      } else {
        product = this.productRepository.create({
          ...productData,
          status: true,
        });
      }
      const savedProduct = await this.productRepository.save(product);
      upsertedProduct.push(savedProduct);
    }
    return upsertedProduct;
  }
}
