import { Controller, Post, Body } from '@nestjs/common';
import { RacePredictionModel } from 'declarations/models/race_predictions.model';
import { RacePredictionsService } from './race-predictions.service';
import { RacePredictionDto } from 'shared_modules/data-transfer/race-prediction';

//ガードの設定が必要
@Controller('race-predictions')
export class RacePredictionsController {

  constructor(
    private racePredictionSvc: RacePredictionsService, 
  ) { }

  /**
   * レース予想情報保存処理
   * 処理成功時、データのキーと、最終更新日時数値(文字列型)を返す。
   * 最終更新日時数値を文字列にしているのは数値の桁数がGraphQLで扱える数値の桁数を超えているため。
   * 最終更新日時数値はDate.prototype.getTime()で取得される値。
   * @param body 
   * @returns 
   */
  @Post('save')
  async saveRacePrediction(@Body() body: RacePredictionModel): Promise<RacePredictionDto.Response.Save> {
    const res = this.racePredictionSvc.saveRacePrediction(body);
    return res;
  }
}
