import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PredictionFormService, StartingBoatFormControl, StartingFormationFormGroup } from '../prediction-form.service';
import { getBoatColorClass } from '../../common/utilities';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { StartTimingInputComponent } from './start-timing-input.component';
import { StartTiming } from 'projects/main/src/app/common/utilities';

@Component({
  selector: 'app-approach-formation',
  template: `
    <form [formGroup]="startFormationFg" class="h-full w-full flex flex-col p-2">
      <!--メインコンテンツ-->
      <div 
        class="grow flex flex-col justify-around starting-boats bg-blue-400 pl-2"
        cdkDropList
        (cdkDropListDropped)="drop($event)"
      >
        <div 
          *ngFor="let course of startFormationFg.boats; let courseIndex = index" 
          class="grow flex items-center starting-boat"
          cdkDrag
        >
          <!--艇番の表示-->
          <div class="h-10 w-16 text-center pt-2" [ngClass]="getBoatColorClass(course.boatNo)">{{course.boatNo}}</div>
          <!--ボートのイメージ-->
          <div class="ml-8 mr-40 border-r-blue-500 border-l-blue-500 border-r border-l h-full flex flex-col justify-center items-end">
            <img 
              [src]="'/assets/images/boat.png'" 
              alt="ボート" 
              class="w-[15%] h-auto"
              [style.marginRight]="startPosition(course.value?.stNumber || 0)"
            >
          </div>
          <div class="w-12">{{course.value?.displayValue}}</div>
          <div>
            <button type="button" mat-icon-button (click)="openStInputDialog(courseIndex + 1, course.boatNo)">
              <mat-icon>edit</mat-icon>
            </button>
          </div>
        </div>
      </div>
    </form>
  `,
  styles: [`
    /* ドラッグ中の状態 */
    .cdk-drag-preview {
        box-sizing: border-box;
        border-radius: 4px;
        box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
            0 8px 1px 1px rbga(0, 0, 0, 0.14), 
            0 3px 14px 2px rgba(0, 0, 0, 0.12);
    }

    /* ドロップ時のアニメーション */
    .cdk-drag-animating {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    /* ドラッグ中、ドラッグ対象とは別のリストアイテムの移動を表すアニメーション */
    .starting-boats.cdk-drop-list-dragging .starting-boat:not(.cdk-placeholder) {
        transition: transform 250ms cubic-beizer(0, 0, 0.2, 1);
    }
  `]
})
export class ApproachFormationComponent implements OnInit {
  //進入体系フォームグループ
  @Input() startFormationFg!: StartingFormationFormGroup;

  //進入体系変更イベント
  @Output() formationChanged = new EventEmitter<void>();

  //艇番表示色取得クラス
  getBoatColorClass = getBoatColorClass;

  constructor(
    //public fg: PredictionFormService, 
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    //開発用、処理が固まったら以下は削除。
  }

  /**
   * コースドラッグドロップイベント
   * @param event 
   */
  drop(event: CdkDragDrop<StartingBoatFormControl[]>) {
    moveItemInArray(
      this.startFormationFg.boatsArray.controls, 
      event.previousIndex, 
      event.currentIndex, 
    )

    //進入体系更新後処理を発火する。
    this.formationChanged.emit();
  }

  /**
   * スタート位置取得処理
   * テンプレートから呼び出される。
   * @param pt
   * @returns 
   */
  startPosition(st: number | null): string {
    if (st === null) {
      return `100%`;
    } else {
      return `${100 * st}%`;
    }
  }

  openStInputDialog(course: number, boatNo: number) {
    this.dialog.open<StartTimingInputComponent, undefined, StartTiming>(StartTimingInputComponent).afterClosed().subscribe(result => {
      console.log(`結果:${JSON.stringify(result)}`);
      console.log(`確認:${result instanceof StartTiming}`);
      if (result) {
        this.startFormationFg.setSt(course, boatNo, result);
      }
    });
  }
}
