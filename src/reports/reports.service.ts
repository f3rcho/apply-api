import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../products/models/product';
import { Between, IsNull, Not, Repository } from 'typeorm';
import { GenerateReport, ReportsDto } from './reports.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}
  async getDeletedProductPercentage() {
    const totalProducts = await this.productRepository.count();
    const deletedProduct = await this.productRepository.count({
      where: {
        status: false,
      },
    });

    return (deletedProduct / totalProducts) * 100;
  }

  async getNonDeletedProductsPercentage(payload: ReportsDto) {
    const { init, end } = payload;
    const where = {
      status: true,
      price: payload.hasPrice ? Not(IsNull()) : IsNull(),
    };

    if (init && end) {
      where['createdAt'] = Between(init, end);
    }

    const totalProducts = await this.productRepository.count();
    const nonDeletedProducts = await this.productRepository.count({ where });
    return (nonDeletedProducts / totalProducts) * 100;
  }

  async getProductsCountByCategoryActive(category: string) {
    const where = {
      status: true,
      category,
    };
    return await this.productRepository.count({ where });
  }

  async generateReport({ init, end, category, hasPrice }: GenerateReport) {
    const where = {};
    if (init && end) {
      where['createdAt'] = Between(init, end);
    }

    const totalProducts = await this.productRepository.count({
      where,
    });

    where['status'] = false;
    const deletedProduct = await this.productRepository.count({
      where,
    });

    const deletedProductPercentage = (deletedProduct / totalProducts) * 100;

    where['status'] = true;
    where['price'] = hasPrice ? Not(IsNull()) : IsNull();

    const nonDeletedProducts = await this.productRepository.count({
      where,
    });
    const getNonDeletedProductsPercentage =
      (nonDeletedProducts / totalProducts) * 100;

    where['category'] = category;
    console.log(where);
    const productsByCategory = await this.productRepository.count({
      where,
    });
    return {
      deletedProductPercentage,
      getNonDeletedProductsPercentage,
      productsByCategory,
    };
  }
}
