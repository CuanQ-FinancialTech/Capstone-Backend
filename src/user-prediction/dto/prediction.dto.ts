import { IsNotEmpty, IsDate, IsNumber, IsString, Min } from 'class-validator';

export class PredictionDto {
    @IsDate()
    @IsNotEmpty({ message: 'Tanggal tidak boleh kosong' })
    days: Date;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    yhat_income: number;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    yhat_expense: number;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    net_prediction: number;
}
