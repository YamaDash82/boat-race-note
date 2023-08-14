import { RacePredictionmModel } from "src/models/race_predictions.model";
import { Resolver, Query, Args } from '@nestjs/graphql';
import { RacePredictionsService } from "./race-predictions.service";

@Resolver(of => RacePredictionmModel) 
export class RacePredictionsResolver {
  constructor (
    private racePredictionsSvc: RacePredictionsService, 
  ) { } 
  
  @Query(() => RacePredictionmModel) 
  async racePrediction(@Args('key') key: string) {
    return this.racePredictionsSvc.findOne(key);
  }
}