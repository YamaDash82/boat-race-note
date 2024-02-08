import { Component, Input } from '@angular/core';
import { RacersModel } from 'projects/main/src/generated/graphql';

/**
 * レーサー期別成績コンポーネント
 * 出走表のような形で表示する。
 */
@Component({
  selector: 'app-racer-period-result',
  template: `
    <!--ラベル-->
    <div *ngIf="labelVisible" class="flex text-center">
      <div class="w-[2rem] h-14 pt-3 border-y border-l border-r border-slate-500 bg-blue-600 text-white">
        枠
      </div>
      <div class="w-[12rem] h-14 pt-3 border-y border-r border-slate-500 bg-blue-600 text-white">レーサー</div>
      <div class="w-[4rem] h-14 pt-3 border-y border-r border-slate-500 bg-blue-600 text-white">平均ST</div>
      <div class="w-[4rem] h-14 flex flex-col justify-around border-y border-r border-slate-500 bg-blue-600 text-white">
        <div>勝率</div>
        <div>二連率</div>
      </div>
      <!--コース別成績-->
      <div *ngFor="let c of courseDataIndexes" class="bg-blue-600 text-white">
        <div class="w-[6rem] flex flex-col justify-around h-14 border-y border-r border-slate-500">
          <div>{{c+1}}コース</div>
          <div>ST/二連率</div>
        </div>
      </div>
    </div>
    <!--内容-->
    <div class="flex items-center">
      <!--艇番-->
      <div 
        class="w-[2rem] h-20 border-l border-b border-r border-slate-500 flex flex-col justify-center items-center" 
        [ngClass]="getBoatColorClass(boatNo)"
      >
        <div>{{boatNo}}</div>
      </div>
      <!--レーサー-->
      <div 
        class="w-[12rem] h-20 flex flex-col justify-around border-b border-r border-slate-500"
        [ngClass]="getBoatColorClass(boatNo)"
      >
        <!--登録番号-->
        <div class="pl-2">
          {{racer?.racer_no}}/{{racer?.rank}}
        </div>
        <!--氏名/年齢-->
        <div class="flex text-center pl-2">
          <div>{{racer?.name_kanji}}</div>
          <div class="pl-1">{{racer?.age}}<span *ngIf="racer">歳</span></div>
        </div>
        <!--期/支部-->
        <div class="flex text-center pl-2 w-full">
          <div>{{racer?.training_term}}<span *ngIf="racer">期</span></div>/
          <div>{{racer?.branch}}</div>
        </div>
      </div>
      <!--平均ST-->
      <div class="w-[4rem] h-20 flex items-center justify-center border-b border-r border-slate-500">
        <div>
          {{racer?.st}}
        </div>
      </div>
      <!--勝率/二連対率-->
      <div class="w-[4rem] h-20 flex flex-col justify-around items-center border-b border-r border-slate-500">
        <div>{{racer?.win_rate}}</div>
        <div>{{racer?.win_rate2}}</div>
      </div>
      <!--コース別情報-->
      <div *ngFor="let c of courseDataIndexes" class="w-[6rem] h-20 flex flex-col justify-around items-center border-b border-r border-slate-500">
        <!--コース別平均ST-->
        <div>{{racer?.course_datas?.[c]?.st}}</div>
        <!--コース別二連対率-->
        <div>{{racer?.course_datas?.[c]?.win_rate2}}</div>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class RacerPeriodResultComponent {
  @Input() labelVisible = true;
  @Input() boatNo!: number;
  @Input() racer: RacersModel | null = null;
  
  //コース別情報インデックス
  courseDataIndexes = [0, 1, 2, 3, 4, 5];

  getBoatColorClass(boatNo: number): any {
    return {
      "boat-color1": boatNo === 1,
      "boat-color2": boatNo === 2, 
      "boat-color3": boatNo === 3,
      "boat-color4": boatNo === 4,
      "boat-color5": boatNo === 5,
      "boat-color6": boatNo === 6
    }
  }
}
