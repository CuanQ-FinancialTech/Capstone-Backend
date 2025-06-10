import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AccountDto } from './dto/account.dto';

@Injectable()
export class AccountRepository {
    constructor(@Inject('DATA_SOURCE') private readonly dataSource: DataSource) { }

    async getAccountByUserId(userId: number): Promise<AccountDto> {
        const result = await this.dataSource.query(
        `SELECT 
            account_id AS "accountId", 
            user_id AS "userId", 
            balance, 
            created_at AS "createdAt", 
            updated_at AS "updatedAt"
        FROM account
        WHERE user_id = ?`,
            [userId],
        );

        if (result.length === 0) {
            throw new NotFoundException('Account not found for this user');
        }

        return result[0];
    }
}
