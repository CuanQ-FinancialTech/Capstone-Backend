import { IsNumber, IsPositive } from 'class-validator';

export class UpdateAccountBalanceDto {
  @IsNumber()
  @IsPositive()
  accountId: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  newBalance: number;
}