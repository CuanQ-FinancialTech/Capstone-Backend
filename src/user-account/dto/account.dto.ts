import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class AccountDto {
  @IsNumber()
  @IsPositive()
  accountId: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  balance: number;

  @IsOptional()
  createdAt?: string;

  @IsOptional()
  updatedAt?: string;
}