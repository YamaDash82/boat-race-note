import { Component, ViewChild, OnInit } from '@angular/core';
import { PaginatorComponent } from '../../general/paginator/paginator.component';
import { PredictionFormService, StartingFormationFormGroup, } from '../prediction-form.service';
import { getBoatColorClass } from '../../common/utilities';
import { RacersModel } from 'projects/main/src/generated/graphql';

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
      <div class="grow flex">
        <!--進入予想部分-->
        <app-approach-formation 
          *ngIf="currentApproachPrediction"
          [startFormationFg]="currentApproachPrediction"
          class="w-2/3"
        ></app-approach-formation>
        <!--コース別データ-->
        <div 
          *ngIf="currentApproachPrediction"
          class="flex flex-col"
        >
          <!--<div>データ</div>-->
          <!--データ表示部-->
          <!--ヘッダー-->
          <div class="flex">
            <!--<div>枠</div>-->
            <div class="ml-4 w-16 text-center bg-blue-600 text-white">平均ST</div>
            <div class="w-96 bg-blue-600 text-white text-center">コース別データ(上段:平均ST/下段:平均ｽﾀｰﾄ順)</div>
          </div>
          <!--内容-->
          <div
            *ngFor="let boat of currentApproachPrediction.boats; index as boatIndex"
            class="flex grow border-b border-blue-500"
          >
            <!--枠番-->
            <div 
              class="w-4 text-center flex items-center"
              [ngClass]="getBoatColoarClass(boat.boatNo)"
            >
              <div class="grow">{{boat.boatNo}}</div>
            </div>
            <!--平均ST-->
            <div class="w-16 border-x border-blue-500 text-center flex items-center">
              <div class="grow">{{getRacerInfo(boat.boatNo).st}}</div>
            </div>
            <!--コース別データ-->
            <div 
              *ngFor="let courseIndex of courseDataIndexes"
              class="flex flex-col w-16 border-r border-blue-500 text-center justify-around"
            >
              <!--コース別平均ST-->
              <div [class.hight-light]="courseIndex===boatIndex">{{getRacerInfo(boat.boatNo).course_datas[courseIndex].st | number : '1.2' }}</div>
              <!--スタート順位-->
              <div [class.hight-light]="courseIndex===boatIndex">{{getRacerInfo(boat.boatNo).course_datas[courseIndex].st_rank | number : '1.1'}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hight-light {
      color: red;
      font-weight: bold;
    }
  `]
})
export class ApproachPredictionComponent implements OnInit {
  @ViewChild(PaginatorComponent) paginator!: PaginatorComponent;
  currentApproachPrediction: StartingFormationFormGroup | null = null;

  getBoatColoarClass = getBoatColorClass;

  //コース別情報インデックス
  courseDataIndexes = [0, 1, 2, 3, 4, 5];

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
    });
  }

  getRacerInfo(boatNo: number): RacersModel {
    return this.fg.racers.items[boatNo - 1].racerInfo as RacersModel;
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
