import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './user-auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { AccountModule } from './user-account/account.module';
import { TransactionModule } from './user-transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // supaya bisa diakses di mana saja tanpa import ulang
    }),
    AuthModule,
    DatabaseModule,
    AccountModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}