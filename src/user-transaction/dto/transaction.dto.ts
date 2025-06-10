import { IsNotEmpty, IsNumber, IsEnum, IsOptional, IsString, IsPositive, Min } from 'class-validator';

import { Transform } from 'class-transformer';
export enum TransactionType {
    INCOME = 'income',
    EXPENSE = 'expense',
}

export class CreateTransactionDto {

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    amount: number;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsEnum(TransactionType)
    @Transform(({ value }) => value.toLowerCase())
    type: TransactionType;

    @IsOptional()
    created_at?: Date;

    @IsNotEmpty({message: 'Wajib diisi'})
    @IsNumber()
    category_id: number;
}
