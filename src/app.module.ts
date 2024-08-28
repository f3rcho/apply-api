import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { ENVIRONMENTS } from './common/const/env.const';
import config from './config/config';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DatabaseModule,
    ProductsModule,
    ConfigModule.forRoot({
      envFilePath: ENVIRONMENTS[(process.env.NODE_ENV || '').toLowerCase()],
      load: [config],
      isGlobal: true,
    }),
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
