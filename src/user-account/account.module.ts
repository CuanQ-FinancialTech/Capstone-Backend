import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AccountRepository } from './account.repository';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/user-auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule], // import AuthModule biar bisa pakai JWT guard
  controllers: [AccountController],
  providers: [AccountService, AccountRepository],
})
export class AccountModule {}
