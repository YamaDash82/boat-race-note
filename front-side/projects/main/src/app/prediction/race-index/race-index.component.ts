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
      <div class="flex items-center mb-2">
        <div class="text-2xl flex items-center border border-red-500 rounded-lg">
          <div 
            class="vertical-label h-24 pt-2 px-2 bg-red-500 text-white"  
          >開催日</div>
          <input 
            [matDatepicker]="picker" 
            [formControl]="fg.raceDate"
            class="bg-opacity-0 bg-gray-400 w-40 pl-5"
            id="race-date"
          >
          <mat-datepicker-toggle  [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </div>
      </div>
      <!--開催場-->
      <div class="flex mb-2">
        <div class="flex justify-arround flex-wrap border border-red-500 rounded-lg text-2xl">
          <div class="vertical-label bg-red-500 text-white pt-4 px-2">開催場</div>
          <div *ngFor="let racePlace of racePlaces" class="my-2">
            <button 
              class="race-place-button mx-2 h-24 w-10 text-center pr-1 rounded-lg border border-slate-500"
              (click)="selectRacePlace(racePlace.code)"
              [class.selected]="racePlace.code===fg.racePlaceCd.value"
            >
              {{racePlace.name}}
            </button>  
          </div>
        </div>
      </div>
      <!--レース番号-->
      <div class="flex mb-2">
        <div class="flex justify-arround flex-wrap border border-red-500 rounded-lg text-2xl">
          <div class="vertical-label bg-red-500 text-white pt-4 px-2">レース</div>
          <div *ngFor="let raceNo of raceNos" class="my-2">
            <button 
              class="race-no-button text-2xl mx-2 h-24 w-10 text-center pr-1 rounded-lg border border-slate-500"
              (click)="selectRaceNo(raceNo)"
              [class.selected]="raceNo===fg.raceNo.value"
            >{{raceNo}}</button>
          </div>
        </div>
      </div>
      <!--出場レーサー-->
      <div class="flex mt-auto">
        <div>
          <app-racer-period-result 
            *ngFor="let racer of fg.racers.items; let boatIndex = index"
            [boatNo]="boatIndex + 1"
            [racer]="racer.racerInfo"
            [labelVisible]="!boatIndex"
            (racerClicked)="openRacerSearchScreen($event)"
          ></app-racer-period-result>
        </div>
        <a 
          class="block mt-auto ml-auto bg-blue-700 w-24 h-16 pt-4 text-2xl mx-2 text-center text-white rounded-lg"
          [routerLink]="['..', 'contents', 'exhibition']"
        >確定</a>
      </div>
    </form>
  `,
  styles: [`
    .vertical-label {
      writing-mode: vertical-rl;
    }
    .race-place-button {
      display: block;
      writing-mode: vertical-rl;
    }
    .race-no-button {
      display: block;
    }
    .selected {
      color: white;
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
