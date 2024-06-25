import { Component, ViewChild, OnInit } from '@angular/core';
import { PaginatorComponent } from '../../general/paginator/paginator.component';
import { ApproachPredictionFormGroup, PredictionFormService, StartingFormationFormGroup, } from '../prediction-form.service';
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
      <!--参考データ選択部(スタート展示/平均ST/コース別平均ST)-->
      <div class="flex">
        <!--スタート展示タイム設定処理-->
        <button 
          type="button" 
          class="ml-2 mr-2 border text-2xl p-2 rounded-lg bg-red"
          (click)="setStartExhibitionTime()"
          [class.selected-st-type]="currentApproachPrediction?.stType===1"
        >スタート展示</button>
        <!--平均ST設定処理-->
        <button 
          type="button" 
          class="mr-2 border text-2xl p-2 rounded-lg"
          (click)="setAvgTime()"
          [class.selected-st-type]="currentApproachPrediction?.stType===2"
        >平均ST</button>
        <!--コース別平均ST設定処理-->
        <button 
          type="button" 
          class="mr-2 border text-2xl p-2 rounded-lg"
          (click)="setCourseAvgTime()"
          [class.selected-st-type]="currentApproachPrediction?.stType===3"
        >コース別平均ST</button>
      </div>
      <div class="grow flex">
        <!--進入予想部分-->
        <app-approach-formation 
          *ngIf="currentApproachPrediction"
          [startFormationFg]="currentApproachPrediction"
          class="w-2/3"
          (formationChanged)="formationChanged()"
        ></app-approach-formation>
        <!--コース別データ-->
        <div 
          *ngIf="currentApproachPrediction"
          class="flex flex-col"
        >
          <!--データ表示部-->
          <!--ヘッダー-->
          <div class="flex">
            <!--<div>枠</div>-->
            <div class="ml-4 w-16 text-center bg-blue-600 text-white">平均ST</div>
            <div class="grow bg-blue-600 text-white text-center">コース別データ(上段:平均ST/下段:平均ｽﾀｰﾄ順)</div>
          </div>
          <!--内容-->
          <div
            *ngFor="let boat of currentApproachPrediction.boats; index as boatIndex"
            class="flex grow border-b border-blue-500 text-2xl"
          >
            <!--枠番-->
            <div 
              class="w-4 text-center flex items-center"
              [ngClass]="getBoatColoarClass(boat.boatNo)"
            >
              <div class="grow">{{boat.boatNo}}</div>
            </div>
            <!--平均ST-->
            <div class="w-24 border-x border-blue-500 text-center flex items-center">
              <div class="grow">{{getRacerInfo(boat.boatNo).st}}</div>
            </div>
            <!--コース別データ-->
            <div 
              *ngFor="let courseIndex of courseDataIndexes"
              class="flex flex-col w-24 border-r border-blue-500 text-center justify-around"
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
    .selected-st-type {
      color: white;
      --tw-bg-opacity: 1; 
      background-color: rgb(239 68 68 / var(--tw-bg-opacity));
      border-color: rgb(239 68 68 / var(--tw-bg-opacity));
    }
  `]
})
export class ApproachPredictionComponent implements OnInit {
  @ViewChild(PaginatorComponent) paginator!: PaginatorComponent;
  currentApproachPrediction: ApproachPredictionFormGroup | null = null;

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
  pageMoved(movedValue: { index:  number, data: ApproachPredictionFormGroup }) {
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

  /**
   * スタート展示タイム設定処理
   * (注意)タイムをセットする。セット前に進入コースが変更されている場合、対象の艇にタイムをセットする。
   */
  setStartExhibitionTime() {
    if (!this.currentApproachPrediction) return;

    //設定スタートタイミング区分をセットする。
    this.currentApproachPrediction.stType = 1;

    //入力されたスタート展示情報を艇ごとに巡回する。
    this.fg.startExhibition.boats.forEach(startingBoat => {
      //進入予想情報の、値をセットする対象となる艇を検索する。
      const targetBoat = this.currentApproachPrediction?.boats.find(boat => boat.boatNo === startingBoat.boatNo);

      //スタートタイムをセットする。
      targetBoat?.setSt(startingBoat.boatNo, startingBoat.value);
    });
  }

  /**
   * 平均ST設定処理
   */
  setAvgTime() {
    if (!this.currentApproachPrediction) return;

    //設定スタートタイミング区分をセットする。
    this.currentApproachPrediction.stType = 2;

    //艇を巡回する。
    this.currentApproachPrediction.boats.forEach(boat => {
      //対象データを検索する。
      const targetRacer = this.getRacerInfo(boat.boatNo);

      //平均STをセットする。
      boat.setSt(boat.boatNo, targetRacer.st);
    });
  }

  /**
   * コース別平均ST設定処理
   */
  setCourseAvgTime() {
    if (!this.currentApproachPrediction) return;

    //設定スタートタイミング区分をセットする。
    this.currentApproachPrediction.stType = 3;

    //艇を巡回する。
    this.currentApproachPrediction.boats.forEach((boat, index) => {
      //対象データを検索する。
      const targetRacer = this.getRacerInfo(boat.boatNo);

      //コース別平均STをセットする。
      boat.setSt(boat.boatNo, targetRacer.course_datas[index].st);
    });
  }

  /**
   * 進入体系更新後処理
   */
  formationChanged() {
    switch(this.currentApproachPrediction?.stType) {
      case 1: //スタート展示タイム
        this.setStartExhibitionTime();
        break;
      case 2: //平均ST
        this.setAvgTime();
        break;
      case 3: //コース別平均ST
        this.setCourseAvgTime();
        break;
      default:
        //何もしない
    }
  }
}
