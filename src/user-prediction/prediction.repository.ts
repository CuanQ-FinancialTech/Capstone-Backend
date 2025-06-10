import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PredictionDto } from './dto/prediction.dto';

@Injectable()
export class PredictionRepository {
    constructor(
        @Inject('DATA_SOURCE')
        private readonly dataSource: DataSource,
    ) {}

    // GET
    async getPredictionByAccountId(accountId: number) {
        const result = await this.dataSource.query(
            `SELECT 
                DATE(created_at) AS transaction_date,
                SUM(amount) AS total_expense
            FROM 
                transactions
            WHERE 
                created_at >= CURDATE() - INTERVAL 10 DAY
                AND type = 'expense'
                AND account_id = ?
            GROUP BY 
                DATE(created_at)
            ORDER BY 
                transaction_date ASC;
            `,
            [accountId],
        );
        return result;
    }   
}