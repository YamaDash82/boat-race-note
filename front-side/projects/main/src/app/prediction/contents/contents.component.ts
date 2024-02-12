import { Component } from '@angular/core';
import { PredictionFormService } from '../prediction-form.service';
import { RacePlaces, RacePlace } from '@common_modules/constans/race-places';

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
export class ContentsComponent {
  racePlaces = RacePlaces;

  linkButtons: { caption: string, endPoint: string }[] = [
    { caption: "展示", endPoint: "exhibition" }, 
    { caption: "進入予想", endPoint: "approach-prediction" }, 
    { caption: "展開予想", endPoint: "deployment-prediction" }, 
    { caption: "結果", endPoint: "race-result" }, 
  ];

  constructor(
    public fg: PredictionFormService, 
  ) { }

  /**
   * レース場検索
   * @param racePlaceCd 
   * @returns 
   */
  findRacePlace(racePlaceCd: number | null): RacePlace | null {
    if (!racePlaceCd) return null;

    return this.racePlaces.find(rp => rp.code === racePlaceCd) as RacePlace;
  }

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
