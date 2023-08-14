import { Module } from '@nestjs/common';
import { RacePredictionsService } from './race-predictions.service';
import { RacePredictionsController } from './race-predictions.controller';
import { DetaModule } from 'src/deta/deta.module';
import { RacePredictionsResolver } from './race-predictions.resolver';

@Module({
  imports: [
    DetaModule, 
  ], 
  providers: [
    RacePredictionsService,
    RacePredictionsResolver, 
  ],
  controllers: [
    RacePredictionsController, 
  ]
})
export class RacePredictionsModule {}
