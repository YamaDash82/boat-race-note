import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApproachPredictionFormGroup, PredictionFormService } from '../prediction-form.service';
import { PaginatorComponent } from '../../general/paginator/paginator.component';

@Component({
  selector: 'app-select-approach-formation',
  template: `
    <h1 mat-dialog-title>進入体系選択</h1>
    <div 
      class="flex flex-col"
      mat-dialog-content
    >
      <!--ページネーター-->
      <app-paginator
        [aggregate]="fg.approachPredictions.controls"
        (moved)="pageMoved($event)"
      ></app-paginator>
      <!--進入体系表示-->
      <app-approach-formation
        *ngIf="currentApproachPrediction"
        [startFormationFg]="currentApproachPrediction"
      ></app-approach-formation>
    </div>
    <div mat-dialog-actions>
      <!--進入体系選択キャンセル 何もせずダイアログを閉じる。-->
      <button mat-button mat-dialog-close>キャンセル</button>
      <!--選択ボタン 進入体系を選択してダイアログを閉じる。-->
      <button 
        mat-button 
        mat-dialog-close 
        cdkFocusInitial
        (click)="selectApproachPrediction()"
      >選択</button>
    </div>
  `,
  styles: [
  ]
})
export class SelectApproachFormationComponent implements OnInit {
  @ViewChild(PaginatorComponent) paginator!: PaginatorComponent;
  currentApproachPrediction: ApproachPredictionFormGroup | null = null;

  constructor(
    public dialogRef: MatDialogRef<SelectApproachFormationComponent>, 
    public fg: PredictionFormService, 
  ) { }

  ngOnInit(): void {
    //フォームグループに進入予想インデックスが保持されている場合、該当する進入予想を表示する。
    //エラー回避のためSetTimeoutメソッドを用いている。
    setTimeout(() => {
      if (this.fg.approachPredictionIndex !== null) {
        this.paginator.moveAt(this.fg.approachPredictionIndex);
      }
    });
  }

  /**
   * ページ移動後処理
   * ページ移動後ページネーターから移動後の値(進入予想)を返されるのでそれをカレントにセットする。
   * @param movedValue 
   */
  pageMoved(movedValue: { index:  number, data: ApproachPredictionFormGroup }) {
    this.currentApproachPrediction = movedValue.data;
    this.fg.approachPredictionIndex = movedValue.index;
  }

  /**
   * 進入体系選択処理
   * 進入体系を選択してダイアログを閉じる。
   */
  selectApproachPrediction() {
    this.dialogRef.close({
      data: this.paginator.currentIndex,
    });
  }
}
