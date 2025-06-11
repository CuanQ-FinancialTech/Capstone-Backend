import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class TransactionDataDto {
  date: string;
  value: string;
}

export class PredictionRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransactionDataDto)
  data_income: TransactionDataDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransactionDataDto)
  data_expenses: TransactionDataDto[];
}
