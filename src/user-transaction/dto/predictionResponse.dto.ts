export class PredictionResult {
    ds: string;
    yhat_income: number;
    yhat_expense: number;
    net_prediction: number;
}

export class PredictionResponseDto {
    forecast: PredictionResult[];
}
