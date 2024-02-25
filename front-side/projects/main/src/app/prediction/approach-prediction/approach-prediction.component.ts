import { Component, ViewChild, OnInit } from '@angular/core';
import { PaginatorComponent } from '../../general/paginator/paginator.component';
import { PredictionFormService, StartingFormationFormGroup, } from '../prediction-form.service';

@Component({
  selector: 'app-approach-prediction',
  template: `
    <div class="w-full h-[80vh] flex flex-col">
      <!--ページネーター-->
      <div class="flex items-center">
        <button
          mat-icon-button
          type="button"
          (click)="appendItem()"
        >
          <mat-icon>add</mat-icon>
        </button>
        <app-paginator
          [aggregate]="fg.approachPredictions.controls"
          (moved)="pageMoved($event)"
          class="my-2"
        ></app-paginator>
      </div>
        <app-approach-formation 
          *ngIf="currentApproachPrediction"
          [startFormationFg]="currentApproachPrediction"
          class="grow"
        ></app-approach-formation>
    </div>
  `,
  styles: [
  ]
})
export class ApproachPredictionComponent implements OnInit {
  @ViewChild(PaginatorComponent) paginator!: PaginatorComponent;
  currentApproachPrediction: StartingFormationFormGroup | null = null;

  constructor(
    public fg: PredictionFormService, 
  ) { }

  ngOnInit(): void {
    //フォームグループに進入予想インデックスが保持されている場合、該当する進入予想を表示する。
    //エラー回避のためSetTimeoutメソッドを用いている。
    setTimeout(() => {
      if (this.fg.approachPredictionIndex !== null) {
        this.paginator.moveAt(this.fg.approachPredictionIndex);
      }
    })
  }

  /**
   * ページ移動後処理
   * ページ移動後ページネーターから移動後の値(進入予想)を返されるのでそれをカレントにセットする。
   * @param movedValue 
   */
  pageMoved(movedValue: { index:  number, data: StartingFormationFormGroup }) {
    this.currentApproachPrediction = movedValue.data;
    this.fg.approachPredictionIndex = movedValue.index;
  }

  /**
   * 進入予想追加処理
   */
  appendItem() {
    //フォームグループに新規進入予想を追加。
    this.fg.appendApproachPrediction();
    //ページ末尾の追加した進入予想を取得する。
    this.paginator.moveLast();
  }
}
