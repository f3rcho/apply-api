import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Client } from 'pg';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../config/config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        const { dbName, user, port, host, password } = configService.postgres;
        return {
          type: 'postgres',
          database: dbName,
          username: user,
          password,
          port,
          host,
          synchronize: true,
          autoLoadEntities: true,
        };
      },
    }),
  ],
  providers: [
    {
      provide: 'PG',
      useFactory: (configService: ConfigType<typeof config>) => {
        const { user, dbName, password, port, host } = configService.postgres;
        const client = new Client({
          database: dbName,
          port,
          host,
          password,
          user,
        });
        client.connect((err) => {
          if (err) {
            console.error(err.stack, 'ERROR <<');
          } else {
            console.log('Database connected');
          }
        });
        return client;
      },
      inject: [config.KEY],
    },
  ],
  exports: ['PG', TypeOrmModule],
})
export class DatabaseModule {}
