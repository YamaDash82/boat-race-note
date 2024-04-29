import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { StartTiming } from 'projects/main/src/app/common/utilities';
import { DIALOG_ACTION, DialogAction, DialogResult } from 'projects/main/src/app/common/dialog-result';

@Component({
  selector: 'app-start-timing-input',
  template: `
    <h1 mat-dialog-title>スタートタイミング入力</h1>
    <!--ダイアログ本体-->
    <div
      class="flex flex-col"
      mat-dialog-content
    >
      <div>
        {{source.course}}コース {{source.boatNo}}号艇
      </div>
      <div class="flex items-end p-2">
        <!--フライング トグルボタン-->
        <button
          type="button"
          class="text-4xl w-16 rounded-lg border-2"
          (click)="toggleFlying()"
          [class.flying]="isFlying"
          [class.not-flying]="!isFlying"
        >F</button>
        <!--コンマ-->
        <div class="text-4xl font-bold mx-2">.</div>
        <!--数値-->
        <input type="text" 
          [formControl]="startTiming"
          class="appearance-none bg-blue-200 h-10 border-none w-40 px-2 rounded-sm"
        >
      </div>
      <!--入力パッド-->
      <app-number-keys
        (numClick)="numberButtonClicked($event)"
        (clearClcik)="clearButtonClicked()"
        (allClearClick)="allClearButtonClicked()"
      ></app-number-keys>
    </div>

    <!--ダイアログのフッタ-->
    <div
      class="flex justify-between w-full"
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
          (click)="clearSt()"
          color="accent"
          class="w-20"
        >クリア</button>
      </div>
      <div class="ml-2">
        <button type="button" 
          mat-flat-button 
          mat-dialog-close 
          color="primary"
          class="w-20"
          (click)="enterStartTiming()"
        >確定</button>
      </div>
    </div>
  `,
  styles: [`
    .flying {
      /* text-red- の値 */
      --tw-text-opacity: 1;
      color: rgb(239 68 68 / var(--tw-text-opacity));
      /* border-red- の値 */
      --tw-border-opacity: 1;
      border-color: rgb(239 68 68 / var(--tw-border-opacity));
    }

    .not-flying {
      /* border-slate-400の値 */
      --tw-border-opacity: 1;
      border-color: rgb(148 163 184 / var(--tw-border-opacity));
      /* text-slate-400の値 */
      --tw-text-opacity: 1;
      color: rgb(148 163 184 / var(--tw-text-opacity));
    }
  `]
})
export class StartTimingInputComponent implements OnInit {
  //フライングフラグ フライング時True
  isFlying = false;

  //仮のスタートタイミング入力用FormControl
  //※08をなどを表すために、numberではなく、stringで扱う。
  startTiming = new FormControl<string | null>(null);

  constructor(
    public dialogRef: MatDialogRef<StartTimingInputComponent, DialogResult<StartTiming | null> | null>, 
    @Inject(MAT_DIALOG_DATA) public source: {
          course: number, 
          boatNo: number, 
          st: StartTiming | null
        }, 
  ) { }

  ngOnInit(): void {
    if (this.source.st) {
      this.isFlying =this.source.st.isFlying;
      //スタートタイミングの小数点以下の値をセットする。例)0.18のとき"18"をセットする。
      this.startTiming.setValue(this.source.st.getDecimalNumberStr());
    }
  }

  /**
   * スタートタイミング確定処理
   */
  enterStartTiming() {
    try {
      if (this.startTiming.value === null) {
        throw new Error(`スタートタイミングを入力してください。`);
      } else {
        const st = new StartTiming(this.isFlying, parseFloat(`0.${this.startTiming.value}`));
        //ダイアログ結果
        const dialogResult: DialogResult<StartTiming | null> = {
          dialogAction: DIALOG_ACTION.Decision,  //決定ボタンをクリックしたことを示す。
          value: st //スタートタイミング
        };
        this.dialogRef.close(dialogResult);
      }
    } catch(err) {
      throw err;
    }
  }

  /**
   * ダイアログ結果:スタートタイミングクリア
   */
  clearSt() {
    const dialogResult: DialogResult<StartTiming | null> = {
      dialogAction: DIALOG_ACTION.Clear //クリアをクリックしたことを示す。
    };

    this.dialogRef.close(dialogResult);
  }

  /**
   * 数字ボタンクリック時処理
   */
  numberButtonClicked(numStr: string) {
    let inputNumStr = this.startTiming.value?.toString() || "";
    inputNumStr += numStr;
    this.startTiming.setValue(inputNumStr);
  }

  /**
   * クリアボタンクリック時処理
   * 現在の入力値の末尾から１文字消す。
   */
  clearButtonClicked() {
    //現在の入力値
    let numStrs = this.startTiming.value?.toString() || "";

    if (numStrs.length) {
      //数値が入力されているとき、末尾を消す。
      numStrs = numStrs.slice(0, numStrs.length - 1);
      
      if (numStrs.length) {
        //末尾を消して、数値文字が残っているとき、その値をセットする。
        this.startTiming.setValue(numStrs);
      } else {
        //０文字になったら、テキストボックスをリセットする。
        this.startTiming.reset();
      }
    } else {
      //何もしない。
    }
  }

  /**
   * オールクリアボタンクリック時処理
   */
  allClearButtonClicked() {
    this.startTiming.reset();
  }
  /**
   * フライングフラグトグル
   * フライング状態をトグルする。
   */
  toggleFlying() {
    this.isFlying = !this.isFlying;
  }
}