import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { PredictionService } from './prediction.service';
import { PredictionDto } from './dto/prediction.dto';

@Controller('prediction') // Base route: /prediction
export class PredictionController {
    constructor(private readonly predictionService: PredictionService) { }

    @Get() // GET /prediction
    async getAllPredictions() {
    }
}