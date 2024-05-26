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

  @Query(() => [RacePredictionModel], { nullable: true })
  async racePradictions(
    //ユーザーキー 必須
    @Args('user_key') userKey: string,
    //抽出開始日
    @Args('date_from', { nullable: true }) dateFrom?: string, 
    //抽出終了日
    @Args('date_to', { nullable: true }) dateTo?: string, 
    //開催場
    @Args('race_place_cd', { nullable: true }) racePlaceCd?: number
  ) {
    return this.racePredictionsSvc.find(userKey, dateFrom, dateTo, racePlaceCd);
  }
}