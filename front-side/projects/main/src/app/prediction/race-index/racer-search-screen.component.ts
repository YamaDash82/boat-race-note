import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { RacersModel } from 'projects/main/src/generated/graphql';
import { PredictionFormService } from '../prediction-form.service';
import { PredictionViewModelService } from '../prediction-view-model.service';
import { ExDate } from '@yamadash82/yamadash-ex-primitive';

@Component({
  selector: 'app-racer-search-screen',
  template: `
    <h1 mat-dialog-title>レーサー検索</h1>
    <div mat-dialog-content>
      ナンバーキーとか 選択艇番<span>{{data}}</span>
    </div>
    <div>
      <input type="number" [formControl]="racerNo">
    </div>
    <div *ngIf="racerInfo" class="flex">
      <div>{{racerInfo.name_kanji}}</div>
      <div>
        <button 
          type="button" 
          mat-button color="primary"
          (click)="confirmRacer()"
        >選択</button>
      </div>
    </div>
    <div 
      mat-dialog-actions
    >
      <button
        mat-button
        matDialogClose
      >
        キャンセル
      </button>
    </div>
  `,
  styles: [
  ]
})
export class RacerSearchScreenComponent implements OnInit {
  racerNo = new FormControl<number | null>(null);
  racerInfo: RacersModel | null = null;

  constructor(
    public dialogRef: MatDialogRef<RacerSearchScreenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number, 
    private fg: PredictionFormService, 
    private viewModel: PredictionViewModelService, 
  ) { }

  ngOnInit(): void {
    //登録番号テキスト更新後処理を定義する。
    //RxJSの使い方を追及すると、もっと良い記述方法があるはず。
    this.racerNo.valueChanges.subscribe(value => {
      if (value) {
        let searchKey = value.toString();

        if (searchKey.length > 4) {
          searchKey = searchKey.substring(0, 4);
          setTimeout(() => {
            this.racerNo.setValue(parseInt(searchKey), { emitEvent: false });
          });
        }

        if (searchKey.length === 4) {
          //検索実行
          console.log(`検索実行:${searchKey}`);
          this.viewModel.fetchRacer(this.fg.raceDate.date as ExDate, parseInt(searchKey)).then(racerInfo => {
            console.log(`検索結果取得`);
            this.racerInfo = racerInfo;
          });
        } else {
          //検索クリア
          console.log(`検索クリア`);
          this.racerInfo = null;
        }
      }
    });
  }

  confirmRacer() {
    this.dialogRef.close(this.racerInfo);
  }
}
