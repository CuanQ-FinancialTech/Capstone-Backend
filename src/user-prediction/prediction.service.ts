    import { Injectable } from '@nestjs/common';
import { PredictionRepository } from './prediction.repository';
import { PredictionDto } from './dto/prediction.dto';

@Injectable()
export class PredictionService {
    constructor(
        private readonly predictionRepository: PredictionRepository,
    ) {}

    async getPredictionByAccountId(accountId: number) {
    }
}