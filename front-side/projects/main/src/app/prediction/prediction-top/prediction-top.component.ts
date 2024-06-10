import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { PredictionViewModelService } from '../prediction-view-model.service';
import { RacePredictionModel } from 'projects/main/src/generated/graphql';
import { ExDate } from '@yamadash82/yamadash-ex-primitive';

@Component({
  selector: 'app-prediction-top',
  template: `
    <div class="flex flex-col w-full h-full text-4xl">
      <!--サブヘッダー-->
      <div>
        <a href="#"
          mat-icon-button
          routerLink="/prediction/new-prediction/race-index"
        >
          <mat-icon>add</mat-icon>
        </a>
      </div>
      <!--直近のレース記録一覧-->
      <div class="grow overflow-y-auto m-2 border-2 border-red-500 rounded">
        <!--リストのヘッダ-->
        <div class="bg-red-500 text-white pl-2 h-20 flex items-center"><div>直近の予想記録({{filterFromDate.getYYYYMMDD()}}〜{{filterToDate.getYYYYMMDD()}})</div></div>
        <a *ngFor="let prediction of racePredictions" 
          class="flex items-center border-b border-red-500 h-32 px-2" 
          [routerLink]="[prediction.key, 'contents', 'exhibition']"
        >
          <!--開催日-->
          <div class="mr-4">{{prediction.race_date}}</div>
          <!--開催場-->
          <div class="w-32 mr-1">{{prediction.race_place_name}}</div>
          <!--レース番号-->
          <div class="w-20">{{prediction.race_no}}R</div>
        </a>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class PredictionTopComponent implements OnInit {
  //レース予想一覧
  racePredictions: (RacePredictionModel & { race_place_name: string })[] | null = [];
  //抽出開始日
  filterFromDate!: ExDate;
  //抽出終了日
  filterToDate!: ExDate;

  constructor(
    private auth: AuthService, 
    private viewModel: PredictionViewModelService
  ) { }

  async ngOnInit(): Promise<void> {
    //抽出開始日、抽出終了日をセットする。
    //先に抽出終了日をセットする。本日をセットする。
    this.filterToDate = new ExDate();
    //時間部分を00:00:00.000に整える。
    this.filterToDate.setHours(0,0,0,0);
    //抽出開始日をセットする。１ヶ月前をセットする。
    this.filterFromDate = new ExDate(this.filterToDate);
    this.filterFromDate.setMonth(this.filterToDate.getMonth() - 1);

    if (this.auth.loginUser) {
      //ログイン状態時、直近のレース情報一覧を取得する。
      const params = {
        user_key: this.auth.loginUser.key, 
        date_from: this.filterFromDate, 
        date_to: this.filterToDate
      };
      this.racePredictions = await this.viewModel.fetchRacePredictions(params);
    }
  }
}
