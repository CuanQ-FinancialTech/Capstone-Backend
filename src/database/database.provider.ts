// database.provider.ts
import { ConfigService } from '@nestjs/config';
import { CreateDataSource } from './datasource';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const dataSource = CreateDataSource(configService);
      try {
        return await dataSource.initialize();
      } catch (error) {
        console.error('Error initializing data source:', error);
        throw error;
      }
    },
  },
  {
    provide: DataSource,
    useExisting: 'DATA_SOURCE',
  },
];
