import { Module } from '@nestjs/common';
import { ProductsService } from './service/products.service';
import { ProductsController } from './controller/products.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { Product } from './models/product';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('config.api.HTTP_TIMEOUT'),
        maxRedirects: configService.get('config.api.HTTP_MAX_REDIRECTS'),
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
