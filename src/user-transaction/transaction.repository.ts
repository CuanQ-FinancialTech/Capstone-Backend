import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateTransactionDto } from './dto/transaction.dto';
import axios from 'axios';

@Injectable()
export class TransactionRepository {
    constructor(@Inject('DATA_SOURCE') private readonly dataSource: DataSource) { }

    async findAccountByUserId(userId: number) {
        const result = await this.dataSource.query(
            `SELECT account_id, balance FROM account WHERE user_id = ?`,
            [userId],
        );
        return result[0];
    }


    async findByUserId(userId: number) {
        return this.dataSource.query(`
        SELECT t.transaction_id, t.amount, t.description, t.type, t.created_at
            FROM transactions t
            JOIN account a ON t.account_id = a.account_id
            WHERE a.user_id = ?
        ORDER BY t.created_at DESC`,
            [userId],
        );
    }

    async createTransaction(accountId: number, dto: CreateTransactionDto) {
        const { amount, description, type , categoryId} = dto;

        const result = await this.dataSource.query(
            `INSERT INTO transactions (account_id, amount, description, type, category_id) VALUES (?, ?, ?, ?, ?)`,
            [accountId, amount, description, type, categoryId],
        );

        return {
            transaction_id: result.insertId,
            account_id: accountId,
            amount,
            description,
            type,
            categoryId,
        };
    }

    async updateAccountBalance(accountId: number, newBalance: number) {
        const result = await this.dataSource.query(
            `UPDATE account SET balance = ? WHERE account_id = ?`,
            [newBalance, accountId]
        );
        return result[0];
    }
}
