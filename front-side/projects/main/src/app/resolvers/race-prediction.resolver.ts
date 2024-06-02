import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { PredictionViewModelService } from '../prediction/prediction-view-model.service';
import { PredictionFormService } from '../prediction/prediction-form.service';
import { ExDate } from '@yamadash82/yamadash-ex-primitive';

/**
 * レース予想リゾルバ
 * レース予想入力に遷移時に呼び出されるリゾルバ。
 * 既存データロード時も、新規予想データ追加時もこのリゾルバを呼び出す。
 * @param route 
 * @param state 
 * @returns 
 */
export const racePredictionResolver: ResolveFn<void> = async (route, state): Promise<void> => {
  const viewModel = inject(PredictionViewModelService);
  const form = inject(PredictionFormService);
  //フォームを初期化する。
  form.reset();

  //URLからレース予想情報の識別子を取得する。
  //値が取得できたときは、既存データをロードするとき、取得できなかったときは、新しい予想情報を追加するときである。
  const predictionKey = route.paramMap.get('prediction-key');

  if (predictionKey) {
    //既存データをロードする。
    const model = await viewModel.fetchRacePrediction(predictionKey);

    if (model) form.setModel(model);
  } else {
    //新規予想情報追加時、開催日をシステム日付で初期化する。
    form.raceDate.setValue(new ExDate());
  }
  return;
};
