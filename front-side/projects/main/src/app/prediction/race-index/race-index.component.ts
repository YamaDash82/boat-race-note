import { Component, OnInit } from '@angular/core';
import { PredictionFormService } from '../prediction-form.service';
import { RacePlace, RacePlaces } from '@common_modules/constans/race-places';
import { RaceNos } from '@common_modules/constans/race-numbers';
import { ExDate } from '@yamadash82/yamadash-ex-primitive';
import { MatDialog } from '@angular/material/dialog';
import { RacerSearchScreenComponent } from './racer-search-screen.component';
import { RacersModel } from 'projects/main/src/generated/graphql';

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
          (racerClicked)="openRacerSearchScreen($event)"
        ></app-racer-period-result>
      </div>
      <div>
        {{ fg.value | json }}
      </div>
      <div class="mt-auto">
        <a 
          mat-raised-button  
          class="ml-auto"
          routerLink="/prediction/contents/exhibition"
        >確定</a>
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
    private dialog: MatDialog, 
    public fg: PredictionFormService, 
  ) {

  }

  async ngOnInit(): Promise<void> {
    //入力ダイアログの開発時用。不要になったら消す。
    const dialogRef = this.dialog.open(RacerSearchScreenComponent, {
      data: 1
    });
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

  openRacerSearchScreen(boatNo: number): void {
    const dialogRef = this.dialog.open(RacerSearchScreenComponent, {
      data: boatNo
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fg.racers.setRacerInfo(boatNo, result);
      }
    });
  }
}
