import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateTransactionDto } from './dto/transaction.dto';
import { } from './dto/predictionResponse.dto';
import { } from './dto/predictionRequest.dto';


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

    async findCategoryIdByName(category: string): Promise<number | null> {
        const result = await this.dataSource.query(
            `SELECT category_id FROM transaction_category WHERE LOWER(category) = LOWER(?) LIMIT 1`,
            [category]
        );

        return result.length > 0 ? result[0].category_id : null;
    }

    async createTransaction(accountId: number, dto: CreateTransactionDto) {
        const { amount, description, type, category_id } = dto;

        const result = await this.dataSource.query(
            `INSERT INTO transactions (account_id, amount, description, type, category_id) VALUES (?, ?, ?, ?, ?)`,
            [accountId, amount, description, type, category_id],
        );

        return {
            transaction_id: result.insertId,
            account_id: accountId,
            amount,
            description,
            type,
            category_id,
        };
    }

    async updateAccountBalance(accountId: number, newBalance: number) {
        const result = await this.dataSource.query(
            `UPDATE account SET balance = ? WHERE account_id = ?`,
            [newBalance, accountId]
        );
        return result[0];
    }

    // Agregasi income per hari - 10 hari terakhir
    async getDailyIncomeSummary(accountId: number) {
        return this.dataSource.query(
            `
    SELECT DATE(created_at) AS transaction_date, SUM(amount) AS total_income
    FROM transactions
    WHERE account_id = ? AND type = 'income'
      AND created_at >= CURDATE() - INTERVAL 10 DAY
    GROUP BY DATE(created_at)
    ORDER BY DATE(created_at) ASC
    `,
            [accountId]
        );
    }

    // Agregasi expense per hari - 10 hari terakhir
    async getDailyExpenseSummary(accountId: number) {
        return this.dataSource.query(
            `
    SELECT DATE(created_at) AS transaction_date, SUM(amount) AS total_expense
    FROM transactions
    WHERE account_id = ? AND type = 'expense'
      AND created_at >= CURDATE() - INTERVAL 10 DAY
    GROUP BY DATE(created_at)
    ORDER BY DATE(created_at) ASC
    `,
            [accountId]
        );
    }
    // async findTransactionsInDateRange(accountId: number, start: Date, end: Date) {
    //     const startStr = start.toISOString().slice(0, 19).replace('T', ' ');
    //     const endStr = end.toISOString().slice(0, 19).replace('T', ' ');

    //     return this.dataSource.query(
    //         `SELECT amount, type, created_at 
    //             FROM transactions 
    //             WHERE account_id = ? 
    //             AND created_at BETWEEN ? AND ? 
    //             ORDER BY created_at DESC`,
    //         [accountId, startStr, endStr],
    //     );
    // }
}
