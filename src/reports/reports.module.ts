import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'products/models/product';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}
