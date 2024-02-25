import { Component, OnInit } from '@angular/core';
import { PredictionFormService } from '../prediction-form.service';
import { RacePlaces, RacePlace } from '@common_modules/constans/race-places';
import { getBoatColorClass } from '../../common/utilities';
import { ExDate } from '@yamadash82/yamadash-ex-primitive';

@Component({
  selector: 'app-contents',
  template: `
    <div class="h-full w-full">
      <div class="h-[5vh] bg-red-400 flex items-center">
        <!--レース情報編集ボタン-->
        <a
          type="button"
          mat-icon-button
          routerLink="/prediction/race-index"
        ><mat-icon>edit</mat-icon></a>
        <!--開催日-->
        <div class="flex flex-col mr-2 w-[10rem]">
          <div>開催日</div>
          <div>{{fg.raceDate.dateStrValue}}</div>
        </div>
        <!--レース場-->
        <div class="flex flex-col mr-2 w-[6rem]">
          <div>開催場</div>
          <div>{{findRacePlace(fg.racePlaceCd.value)?.name}}</div>
        </div>
        <!--レース番号-->
        <div class="mr-2 w-[4rem]">{{fg.raceNo.value}}<span *ngIf="fg.raceNo">R</span></div>
        <!--出走レーサー-->
        <div 
          *ngFor="let racer of fg.racers.items; index as boatIndex;" 
          class="grow flex flex-col px-2"
          [ngClass]="getBoatColorClass(boatIndex + 1)"
        >
          <div>{{boatIndex + 1}}号艇</div>
          <div>{{racer?.racerInfo?.name_kanji}}</div>
        </div>
      </div>
      <!--サブヘッダー-->
      <div class="h-[5vh] bg-red-300 flex items-center">
        <a 
          *ngFor="let linkButton of linkButtons" 
          mat-flat-button class="block ml-2"
          [routerLink]="linkButton.endPoint"
         >{{linkButton.caption}}</a>
         <button type="button" mat-raised-button class="ml-auto mr-2" color="primary">保存</button>
      </div>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [
  ]
})
export class ContentsComponent implements OnInit {
  racePlaces = RacePlaces;

  //艇番表示色取得クラス
  getBoatColorClass = getBoatColorClass;

  linkButtons: { caption: string, endPoint: string }[] = [
    { caption: "展示", endPoint: "exhibition" }, 
    { caption: "進入予想", endPoint: "approach-prediction" }, 
    { caption: "展開予想", endPoint: "deployment-prediction" }, 
    { caption: "結果", endPoint: "race-result" }, 
  ];

  constructor(
    public fg: PredictionFormService, 
  ) { }

  async ngOnInit(): Promise<void> {
    //開発時、テストデータのセットをここに集約する。
    this.fg.raceDate.setValue(new ExDate())
    //テストデータの表示
    //レース場
    this.fg.racePlaceCd.setValue(10);
    this.fg.raceNo.setValue(7);
    this.fg.setRacer(1, 4505);
    this.fg.setRacer(2, 4150);
    this.fg.setRacer(3, 3445);
    this.fg.setRacer(4, 4826);
    this.fg.setRacer(5, 4640);
    this.fg.setRacer(6, 4488);
    //this.fg.startExhibition.initialize();
    if (!this.fg.startExhibition.boats[0].value) {
      this.fg.setStartExhibitionSt(1, 1, 0.2);
      this.fg.setStartExhibitionSt(2, 2, 0.13);
      this.fg.setStartExhibitionSt(3, 3, -0.05);
      this.fg.setStartExhibitionSt(4, 4, 0.19);
      this.fg.setStartExhibitionSt(5, 5, 0.04);
      this.fg.setStartExhibitionSt(6, 6, 0.09);
    }
  }

  /**
   * レース場検索
   * @param racePlaceCd 
   * @returns 
   */
  findRacePlace(racePlaceCd: number | null): RacePlace | null {
    if (!racePlaceCd) return null;

    return this.racePlaces.find(rp => rp.code === racePlaceCd) as RacePlace;
  }
}
