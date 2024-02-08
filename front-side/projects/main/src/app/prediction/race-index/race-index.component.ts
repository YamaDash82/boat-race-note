import { Component, OnInit } from '@angular/core';
import { PredictionFormService } from '../prediction-form.service';
import { RacePlace, RacePlaces } from '@common_modules/constans/race-places';
import { RaceNos } from '@common_modules/constans/race-numbers';
import { ExDate } from '@yamadash82/yamadash-ex-primitive';

@Component({
  selector: 'app-race-index',
  template: `
    <form 
      [formGroup]="fg"
      class="w-full h-full p-2 flex flex-col"
    >
      <!--開催日-->
      <div>
        <mat-form-field>
          <mat-label>開催日</mat-label>
          <input matInput [matDatepicker]="picker" [formControl]="fg.raceDate">
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
      </div>
      <!--開催場-->
      <div class="flex justify-arround flex-wrap">
        <div *ngFor="let racePlace of racePlaces">
          <button 
            mat-stroked-button 
            class="race-place-button"
            (click)="selectRacePlace(racePlace.code)"
            [class.selected]="racePlace.code===fg.racePlaceCd.value"
          >
            {{racePlace.name}}
          </button>  
        </div>
      </div>
      <!--レース番号-->
      <div class="flex">
        <div *ngFor="let raceNo of raceNos">
          <button 
            mat-stroked-button
            (click)="selectRaceNo(raceNo)"
            [class.selected]="raceNo===fg.raceNo.value"
          >{{raceNo}}</button>
        </div>
      </div>
      <!--出場レーサー-->
      <div>
        <app-racer-period-result 
          *ngFor="let racer of fg.racers.items; let boatIndex = index"
          [boatNo]="boatIndex + 1"
          [racer]="racer.racerInfo"
          [labelVisible]="!boatIndex"
        ></app-racer-period-result>
      </div>
      <div>
        {{ fg.value | json }}
      </div>
    </form>
  `,
  styles: [`
    .race-place-button {
      display: block;
      writing-mode: vertical-rl;
      height: 4rem;
    }
    .selected {
      background-color: royalblue;
      font-weight: bold;
    }
  `]
})
export class RaceIndexComponent implements OnInit {
  racePlaces = RacePlaces;
  raceNos = RaceNos;

  constructor(
    public fg: PredictionFormService, 
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.fg.raceDate.setValue(new ExDate())
    //テストデータの表示
    this.fg.setRacer(1, 4505);
    this.fg.setRacer(2, 4150);
    this.fg.setRacer(3, 3445);
    this.fg.setRacer(4, 4826);
    this.fg.setRacer(5, 4640);
    this.fg.setRacer(6, 4488);
  }

  /**
   * 開催場選択処理
   * @param racePlaceCd
   */
  selectRacePlace(racePlaceCd: number) {
    this.fg.racePlaceCd.setValue(racePlaceCd);
  }

  /**
   * レース番号選択処理
   * @param raceNo 
   */
  selectRaceNo(raceNo: number) {
    this.fg.raceNo.setValue(raceNo);
  }
}
