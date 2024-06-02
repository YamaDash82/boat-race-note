import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { PredictionViewModelService } from '../prediction-view-model.service';
import { RacePredictionModel } from 'projects/main/src/generated/graphql';

@Component({
  selector: 'app-prediction-top',
  template: `
    <h1>トップ</h1>
    <div class="flex flex-col">
      <div>
        <a href="#"
          mat-icon-button
          routerLink="/prediction/new-prediction/race-index"
        >
          <mat-icon>add</mat-icon>
        </a>
      </div>
      <div *ngFor="let prediction of racePredictions">
        <div>
          <a [routerLink]="[prediction.key, 'contents']">key:{{prediction.key}}</a>
        </div>
        <div>開催日:{{prediction.race_date}}</div>
        <div>開催場:{{prediction.race_place_cd}}</div>
        <div>レース番号:{{prediction.race_no}}</div>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class PredictionTopComponent implements OnInit {
  //レース予想一覧
  racePredictions: RacePredictionModel[] | null = [];

  constructor(
    private auth: AuthService, 
    private viewModel: PredictionViewModelService
  ) { }

  async ngOnInit(): Promise<void> {
    console.log(`OnInit:${JSON.stringify(this.auth.login, null, 2)}`);
    if (this.auth.loginUser) {
      //ログイン状態時、直近のレース情報一覧を取得する。
      const params = {
        user_key: this.auth.loginUser.key, 
      };
      this.racePredictions = await this.viewModel.fetchRacePredictions(params);
    }
  }
}
