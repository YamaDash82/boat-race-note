import { Injectable } from '@nestjs/common';
import { DetaBaseService } from 'src/deta/deta-base.service';
import { RacePredictionmModel } from 'src/models/race_predictions.model';

@Injectable()
export class RacePredictionsService {
  private racePredictionsBase = this.detaBaseSvc.getBase("r_race_predictions");

  constructor(
    private detaBaseSvc: DetaBaseService, 
  ) { }

  async saveRacePrediction(body: RacePredictionmModel): Promise<{ key: string, last_modified_at: Date }> {
    const { key, ...detail } = body;

    const res = key ?
      await this.racePredictionsBase.put(detail as any, key)
      :
      await this.racePredictionsBase.put(detail as any);
    
    return { key: res.key as string, last_modified_at: new Date() };
  }

  async findOne(key: string): Promise<RacePredictionmModel> {
    const found = await this.racePredictionsBase.get(key);

    return found as any;
  }
}
