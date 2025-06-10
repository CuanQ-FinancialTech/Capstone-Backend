import { Injectable } from '@nestjs/common';
import { AccountRepository } from './account.repository';
import { AccountDto } from './dto/account.dto';

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async getAccountByUserId(userId: number): Promise<AccountDto> {
    return await this.accountRepository.getAccountByUserId(userId);
  }
}
