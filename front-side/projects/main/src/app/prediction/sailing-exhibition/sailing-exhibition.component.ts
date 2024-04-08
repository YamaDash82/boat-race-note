import { Component, OnInit } from '@angular/core';
import { PredictionFormService } from '../prediction-form.service';
import { getBoatColorClass } from '../../common/utilities';

@Component({
  selector: 'app-sailing-exhibition',
  template: `
    <form class="h-full w-full flex flex-col p-2">
      <div>展示航走</div>
      <!--メインコンテンツ-->
      <div *ngFor="let boat of fg.exhibitionTimes.boats;index as boatIndex;" class="grow flex flex-col justify-around">
        <div class="flex items-center">
            <!--艇番の表示-->
            <div 
              class="h-10 w-10 text-center pt-2"
              [ngClass]="getBoatColoarClass(boatIndex + 1)"
            >{{boatIndex + 1}}</div>
            <!--スタートタイミング-->
            <div class="ml-10">{{boat.value}}</div>
          </div>
        </div>
    </form>
  `,
  styles: [
  ]
})
export class SailingExhibitionComponent implements OnInit {
  getBoatColoarClass = getBoatColorClass;

  constructor(
    public fg: PredictionFormService, 
  ) { }

  ngOnInit(): void {
    //テストデータの設定
    //不要になったら消す。
    if (!this.fg.exhibitionTimes.boat1.value) {
      this.fg.setExhibitionTime(1, 6.62);
      this.fg.setExhibitionTime(2, 6.70);
      this.fg.setExhibitionTime(3, 6.69);
      this.fg.setExhibitionTime(4, 6.67);
      this.fg.setExhibitionTime(5, 6.60);
      this.fg.setExhibitionTime(6, 6.63);
    }
  }
}
