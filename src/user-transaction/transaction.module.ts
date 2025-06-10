import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from './transaction.repository';
import { DatabaseModule } from 'src/database/database.module'; // pastikan ada module ini
import { JwtStrategy } from 'src/user-auth/jwt.strategy'; // ambil dari auth module
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository, JwtStrategy],
  exports: [TransactionService],
})
export class TransactionModule {}
