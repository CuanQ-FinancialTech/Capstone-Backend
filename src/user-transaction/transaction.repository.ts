import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateTransactionDto } from './dto/transaction.dto';


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
        SELECT t.transaction_id, t.amount, t.description, t.type, t.created_at, tc.category
            FROM transactions t
                JOIN account a ON t.account_id = a.account_id
                JOIN transaction_category tc ON t.category_id = tc.category_id
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
    WITH RECURSIVE date_range AS (
      SELECT CURDATE() - INTERVAL 9 DAY AS dt
      UNION ALL
      SELECT dt + INTERVAL 1 DAY FROM date_range WHERE dt + INTERVAL 1 DAY <= CURDATE()
    )
    SELECT 
      d.dt AS transaction_date,
      COALESCE(SUM(t.amount), 0) AS total_income
    FROM date_range d
    LEFT JOIN transactions t 
      ON DATE(t.created_at) = d.dt AND t.account_id = ? AND t.type = 'income'
    GROUP BY d.dt
    ORDER BY d.dt ASC
    `,
            [accountId]
        );
    }


    // Agregasi expense per hari - 10 hari terakhir
    async getDailyExpenseSummary(accountId: number) {
        return this.dataSource.query(
            `
    WITH RECURSIVE date_range AS (
      SELECT CURDATE() - INTERVAL 9 DAY AS dt
      UNION ALL
      SELECT dt + INTERVAL 1 DAY FROM date_range WHERE dt + INTERVAL 1 DAY <= CURDATE()
    )
    SELECT 
      d.dt AS transaction_date,
      COALESCE(SUM(t.amount), 0) AS total_expense
    FROM date_range d
    LEFT JOIN transactions t 
      ON DATE(t.created_at) = d.dt AND t.account_id = ? AND t.type = 'expense'
    GROUP BY d.dt
    ORDER BY d.dt ASC
    `,
    [accountId]
        );
    }

}
