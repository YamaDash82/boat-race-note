import { Component, OnInit } from '@angular/core';
import { PredictionFormService } from '../prediction-form.service';
import { getBoatColorClass } from '../../common/utilities';
import { MatDialog } from '@angular/material/dialog';
import { ExhibitionTimeInputComponent } from './exhibition-time-input.component';
import { DIALOG_ACTION, DialogAction, DialogResult } from 'projects/main/src/app/common/dialog-result';

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
            <!--展示タイム-->
            <div class="mx-10 w-16">{{boat.value | number:'1.2-2' }}</div>
            <!--ダイアログ起動ボタン-->
            <div>
              <button type="button" 
                mat-icon-button 
                (click)="openExhibitionTimeInputDialog(boatIndex+1)"
              >
                <mat-icon>edit</mat-icon>
              </button>
            </div>
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
    private dialog: MatDialog, 
  ) { }

  ngOnInit(): void {
  }

  openExhibitionTimeInputDialog(boatNo: number) {
    this.dialog.open<
      ExhibitionTimeInputComponent, 
      {
        boatNo: number; 
        exhibitionTime: number | null;
      } | null, 
      DialogResult<number | null>
    >(
      ExhibitionTimeInputComponent, 
      {
        data: {
          boatNo: boatNo, 
          exhibitionTime: this.fg.exhibitionTimes.boats[boatNo - 1].value
        }
      }
    ).afterClosed().subscribe(result => {
      if (result?.dialogAction === DIALOG_ACTION.Decision) {
        //ダイアログで展示タイムを入力して確定ボタンが押されたときの処理を行う。
        this.fg.exhibitionTimes.setExhibitionTime(boatNo, result.value as number);
      } else if (result?.dialogAction === DIALOG_ACTION.Clear) {
        //ダイアログでクリアボタンが押されたときの処理を行う。
        this.fg.exhibitionTimes.boats[boatNo - 1].reset();
      }
    });
  }
}
