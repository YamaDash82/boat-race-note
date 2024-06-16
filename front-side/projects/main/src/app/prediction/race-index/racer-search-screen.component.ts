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
    <h1 mat-dialog-title>レーサー検索 <span>{{data}}号艇</span></h1>
    <div mat-dialog-content>
      <div class="p-1 text-4xl">
        <input 
          type="number" 
          class="appearance-none bg-blue-200 h-16 border-none w-full px-2 rounded-sm"
          inputmode="none"
          [formControl]="racerNo"
        >
      </div>
      <!--検索結果-->
      <div 
        class="
          flex flex-col h-32 border-blue-500 rounded-lg border-2
          mx-1 px-1 my-2
        "
      >
        <div>
          検索結果
        </div>
        <div *ngIf="racerInfo" class="flex justify-center items-center text-4xl">
          <div>{{racerInfo.name_kanji}}</div>
          <div>
            <button 
              type="button" 
              mat-button color="primary"
              (click)="confirmRacer()"
            >選択</button>
          </div>
        </div>
      </div>
      <app-number-keys
        (numClick)="numberButtonClicked($event)"
        (clearClcik)="clearButtonClicked()"
        (allClearClick)="allClearButtonClicked()"
      ></app-number-keys>
    </div>
    <div 
      mat-dialog-actions
    >
      <button
        mat-flat-button
        matDialogClose
        color="accent"
        class="ml-4"
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

  /**
   * 数字ボタンクリック時処理
   * @param numStr 
   */
  numberButtonClicked(numStr: string) {
    let inputNumStr: string = this.racerNo.value === null ? "" : this.racerNo.value.toString()
    inputNumStr += numStr;
    this.racerNo.setValue(parseInt(inputNumStr));
  }

  /**
   * クリアボタンクリック時処理
   * 現在の入力値の末尾から１文字消す。
   */
  clearButtonClicked() {
    //現在の入力値
    let numStrs = this.racerNo.value?.toString() || "";

    if (numStrs.length) {
      //数値が入力されているとき、末尾を消す。
      numStrs = numStrs.slice(0, numStrs.length - 1);
      
      if (numStrs.length) {
        //末尾を消して、数値文字が残っているとき、その値をセットする。
        this.racerNo.setValue(parseInt(numStrs));
      } else {
        //０文字になったら、テキストボックスをリセットする。
        this.racerNo.reset();
      }
    } else {
      //何もしない。
    }
  }

  /**
   * オールクリアボタンクリック時処理
   */
  allClearButtonClicked() {
    this.racerNo.reset();
  }

  confirmRacer() {
    this.dialogRef.close(this.racerInfo);
  }
}
