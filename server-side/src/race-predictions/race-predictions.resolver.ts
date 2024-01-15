import { RacePredictionModel } from "declarations/models/race_predictions.model";
import { Resolver, Query, Args } from '@nestjs/graphql';
import { RacePredictionsService } from "./race-predictions.service";

@Resolver(of => RacePredictionModel) 
export class RacePredictionsResolver {
  constructor (
    private racePredictionsSvc: RacePredictionsService, 
  ) { } 
  
  @Query(() => RacePredictionModel) 
  async racePrediction(@Args('key') key: string) {
    return this.racePredictionsSvc.findOne(key);
  }
}