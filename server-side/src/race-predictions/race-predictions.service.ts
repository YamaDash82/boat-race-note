import { Injectable } from '@nestjs/common';
import { DetaBaseService } from 'src/deta/deta-base.service';
import { RacePredictionModel } from 'declarations/models/race_predictions.model';
import { RacePredictionDto } from 'shared_modules/data-transfer/race-prediction';

@Injectable()
export class RacePredictionsService {
  private racePredictionsBase = this.detaBaseSvc.getBase("r_race_predictions");

  constructor(
    private detaBaseSvc: DetaBaseService, 
  ) { }

  /**
   * レース予想情報登録処理
   * 処理成功後、キーと最終更新日時の数値(Date.prototype.getTime()で取得される値)を返す。
   * 最終更新日時数値を文字列とするのは、GraphQLで扱える数値の桁数を超えているため。
   * @param body 
   * @returns 
   */
  async saveRacePrediction(body: RacePredictionModel): Promise<RacePredictionDto.Response.Save> {
    const { key, ...detail } = body;

    //最終更新日時をセットする。
    const lastModifiedAt = (new Date()).getTime();

    //データベースに保存する際は文字列型に変換する。
    //Detaが対応している桁数、GraphQLが対応している桁数を超過しているため。
    detail.last_modified_at = lastModifiedAt.toString();

    const res = key ?
      await this.racePredictionsBase.put(detail as any, key)
      :
      await this.racePredictionsBase.put(detail as any);
    
    return { key: res.key as string, lastModifiedAt };
  }

  async findOne(key: string): Promise<RacePredictionModel> {
    const found = await this.racePredictionsBase.get(key);

    return found as any;
  }
}
