import { Controller, Post, Body } from '@nestjs/common';
import { RacePredictionModel } from 'src/models/race_predictions.model';
import { RacePredictionsService } from './race-predictions.service';

//ガードの設定が必要
@Controller('race-predictions')
export class RacePredictionsController {

  constructor(
    private racePredictionSvc: RacePredictionsService, 
  ) { }

  @Post('save')
  async saveRacePrediction(@Body() body: RacePredictionModel): Promise<{ key: string, last_modified_at: Date }> {
    return this.racePredictionSvc.saveRacePrediction(body);
  }
}
