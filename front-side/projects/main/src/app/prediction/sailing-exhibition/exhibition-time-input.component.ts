import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { DIALOG_ACTION, DialogAction, DialogResult } from 'projects/main/src/app/common/dialog-result';

@Component({
  selector: 'app-exhibition-time-input',
  template: `
    <h1 mat-dialog-title>展示タイム入力</h1>
    <!--ダイアログ本体-->
    <div 
      class="flex flex-col"
      mat-dialog-content
    >
      <!--入力展示タイム表示-->
      <div class="flex p-2">
        <!--７秒台-->
        <button
          type="button"
          class="text-4xl w-16 rounded-lg border-2"
          [class.active-second-range]="is7secondsRange"
          [class.deactive-second-range]="!is7secondsRange"
          (click)="setSecondsRange(7)"
        >7<span class="text-sm">秒</span></button>
        <!--６秒台-->
        <button
          type="button"
          class="text-4xl w-16 rounded-lg border-2"
          [class.active-second-range]="is6secondsRange"
          [class.deactive-second-range]="!is6secondsRange"
          (click)="setSecondsRange(6)"
        >6<span class="text-sm">秒</span></button>
        <!--コンマ-->
        <div class="text-4xl font-bold mx-2">.</div>
        <!--数値-->
        <input type="text" 
          [formControl]="exhibitionTimeDecimalStr"
          inputmode="none"
          class="appearance-none bg-blue-200 h-10 border-none w-20 rounded-sm text-xl pl-2 grow"
        >
      </div>
      <!--入力パッド-->
      <app-number-keys
        (numClick)="numberButtonClicked($event)"
        (clearClcik)="clearButtonClicked()"
        (allClearClick)="allClearButtonClicked()"
      ></app-number-keys>
    </div>
    <div
      class="flex justify-between"
      mat-dialog-actions
    >
      <div>
        <button type="button" 
          mat-stroked-button 
          mat-dialog-close
          class="w-20"
        >ｷｬﾝｾﾙ</button>
      </div>
      <div class="ml-auto">
        <button type="button"
          mat-flat-button
          color="accent"
          class="w-20"
          (click)="clearExibhitionTime()"
        >
          クリア
        </button>
      </div>
      <div class="ml-2">
        <button type="button" 
          mat-flat-button 
          mat-dialog-close 
          color="primary"
          class="w-20"
          (click)="enterExhibitionTime()"
        >確定</button>
      </div>
    </div>
  `,
  styles: [`
    .active-second-range {
      /* text-red- の値 */
      --tw-text-opacity: 1;
      color: rgb(239 68 68 / var(--tw-text-opacity));
      /* border-red- の値 */
      --tw-border-opacity: 1;
      border-color: rgb(239 68 68 / var(--tw-border-opacity));
    }

    .deactive-second-range {
      /* border-slate-400の値 */
      --tw-border-opacity: 1;
      border-color: rgb(148 163 184 / var(--tw-border-opacity));
      /* text-slate-400の値 */
      --tw-text-opacity: 1;
      color: rgb(148 163 184 / var(--tw-text-opacity));
    }

  `]
})
export class ExhibitionTimeInputComponent implements OnInit {
  //６秒台フラグ
  is6secondsRange = true;
  //7秒台フラグ
  is7secondsRange = false;

  //展示タイム小数点以下数値文字列
  exhibitionTimeDecimalStr = new FormControl<string | null>(null);

  constructor(
    public dialogRef: MatDialogRef<ExhibitionTimeInputComponent>, 
    @Inject(MAT_DIALOG_DATA) public source: {
      boatNo: number; 
      exhibitionTime: number | null;
    } | null, 
  ) { }

  ngOnInit(): void {
    if (this.source) {
      if (typeof this.source.exhibitionTime === "number") {
        const exhiTime = this.source.exhibitionTime;

        if (exhiTime >= 7) {
          //展示タイムが７秒台
          this.is7secondsRange = true;
          this.is6secondsRange = false;
        } else {
          //７秒台でなければ、デフォルトの６秒台にする。
          this.is6secondsRange = true;
          this.is7secondsRange = false;
        }

        //小数点以下の値をテキストボックスにセットする。
        let decimalValStr = exhiTime.toString();
        //小数点以下の値を取得
        decimalValStr = decimalValStr.substring(decimalValStr.indexOf(".") + 1);
        //小数点２桁編集 
        decimalValStr = `${decimalValStr}00`.substring(0, 2);

        this.exhibitionTimeDecimalStr.setValue(decimalValStr);
      }
    }
  }

  /**
   * 秒台トグル
   * ６秒台、７秒台の状態をトグルする。
   */
  setSecondsRange(secondRange: number) {
    if (secondRange === 6) {
      this.is6secondsRange = true;
      this.is7secondsRange = false;
    } else {
      this.is6secondsRange = false;
      this.is7secondsRange = true;
    }
  }

  /**
   * 展示タイム確定処理
   */
  enterExhibitionTime() {
    //ダイアログ起動元に返す値を生成する。
    const exhiTimeStr = `${this.is7secondsRange ? 7 : 6}.${this.exhibitionTimeDecimalStr.value?.toString().substring(0,2)}`;

    //ダイアログ起動元に、入力した展示タイムを返す。
    const dialogResult: DialogResult<number | null> = {
      dialogAction: DIALOG_ACTION.Decision,
      value: parseFloat(exhiTimeStr)
    };
    this.dialogRef.close(dialogResult);
  }

  /**
   * 展示タイムクリア処理
   */
  clearExibhitionTime() {
    //ダイアログ起動元の展示タイムをクリアする。
    this.dialogRef.close({
      dialogAction: DIALOG_ACTION.Clear
    });
  }

  /**
   * 数字ボタンクリック時処理
   */
  numberButtonClicked(numStr: string) {
    let inputNumStr = this.exhibitionTimeDecimalStr.value?.toString() || "";
    inputNumStr += numStr;
    this.exhibitionTimeDecimalStr.setValue(inputNumStr);
  }

  /**
   * クリアボタンクリック時処理
   * 現在の入力値の末尾から１文字消す。
   */
  clearButtonClicked() {
    //現在の入力値
    let numStrs = this.exhibitionTimeDecimalStr.value?.toString() || "";

    if (numStrs.length) {
      //数値が入力されているとき、末尾を消す。
      numStrs = numStrs.slice(0, numStrs.length - 1);
      
      if (numStrs.length) {
        //末尾を消して、数値文字が残っているとき、その値をセットする。
        this.exhibitionTimeDecimalStr.setValue(numStrs);
      } else {
        //０文字になったら、テキストボックスをリセットする。
        this.exhibitionTimeDecimalStr.reset();
      }
    } else {
      //何もしない。
    }
  }

  /**
   * オールクリアボタンクリック時処理
   */
  allClearButtonClicked() {
    this.exhibitionTimeDecimalStr.reset();
  }
}
