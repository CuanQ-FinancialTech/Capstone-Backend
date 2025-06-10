import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export function CreateDataSource(configService: ConfigService): DataSource {
    return new DataSource({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT')|| '3306', 10),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        synchronize: true,
        entities: [
            // __dirname + '/../**/*.entity{.ts,.js}', // aktifkan kalau pakai entity class
        ],
    });
}
