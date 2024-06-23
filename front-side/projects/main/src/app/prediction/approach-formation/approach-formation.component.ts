import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PredictionFormService, StartingBoatFormControl, StartingFormationFormGroup } from '../prediction-form.service';
import { getBoatColorClass } from '../../common/utilities';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { StartTimingInputComponent } from './start-timing-input.component';
import { StartTiming } from 'projects/main/src/app/common/utilities';
import { DialogAction, DIALOG_ACTION, DialogResult } from 'projects/main/src/app/common/dialog-result';

@Component({
  selector: 'app-approach-formation',
  template: `
    <form [formGroup]="startFormationFg" class="h-full w-full flex flex-col p-2">
      <div class="text-4xl">スタート展示</div>
      <!--メインコンテンツ-->
      <div 
        class="grow flex flex-col justify-around starting-boats bg-blue-400 pl-2 text-4xl"
        cdkDropList
        (cdkDropListDropped)="drop($event)"
      >
        <div 
          *ngFor="let course of startFormationFg.boats; let courseIndex = index" 
          class="grow flex items-center starting-boat"
          cdkDrag
        >
          <!--艇番の表示-->
          <div class="h-20 w-20 text-center pt-4" [ngClass]="getBoatColorClass(course.boatNo)">{{course.boatNo}}</div>
          <!--ボートのイメージ-->
          <div class="ml-10 mr-40 grow border-r-blue-500 border-l-blue-500 border-r border-l h-full flex flex-col justify-center items-end">
            <img 
              [src]="'/assets/images/st-boat'+course.boatNo+'.svg'" 
              alt="ボート" 
              class="w-[15%] h-auto"
              [class.invisible]="!course.value"
              [style.marginRight]="startPosition(course.value?.getStFloat() || 0)"
            >
          </div>
          <div class="w-32">{{course.value?.displayValue}}</div>
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
    const currentSt = this.startFormationFg.boats[course - 1].value
    this.dialog.open<
      StartTimingInputComponent,       //ダイアログに使用するコンポーネント
      {
        course: number, 
        boatNo: number, 
        st: StartTiming | null
      },            //ダイアログに渡す値の型
      DialogResult<StartTiming | null> //ダイアログから帰ってくる値の型
    >(
      StartTimingInputComponent, 
      { 
        data: {
          course: course, 
          boatNo: boatNo, 
          st: this.startFormationFg.boats[course - 1].value
        }
      }
    ).afterClosed().subscribe(dialogResult => {
      
      if (dialogResult?.dialogAction === DIALOG_ACTION.Decision && dialogResult.value) {
        //ダイアログでスタートタイミングが入力されたときの処理
        this.startFormationFg.setSt(course, boatNo, dialogResult.value);
      } else if (dialogResult?.dialogAction === DIALOG_ACTION.Clear) {
        //ダイアログでキャンセルボタンがクリックされたときの処理
        this.startFormationFg.boats[course - 1].setSt(boatNo, null);
      }
    });
  }
}
