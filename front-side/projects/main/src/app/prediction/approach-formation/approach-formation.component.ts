import { Component, OnInit, Input } from '@angular/core';
import { PredictionFormService, StartingBoatFormControl, StartingFormationFormGroup } from '../prediction-form.service';
import { getBoatColorClass } from '../../common/utilities';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-approach-formation',
  template: `
    <form [formGroup]="startFormationFg" class="h-full w-full flex flex-col p-2">
      <!--画面タイトル-->
      <div>スタート展示</div>
      <!--メインコンテンツ-->
      <div 
        class="grow flex flex-col justify-around starting-boats"
        cdkDropList
        (cdkDropListDropped)="drop($event)"
      >
        <div 
          *ngFor="let course of startFormationFg.boats" 
          class="grow flex items-center border-b  border-r border-slate-500 starting-boat"
          cdkDrag
        >
          <!--艇番の表示-->
          <div class="h-10 w-16 text-center pt-2" [ngClass]="getBoatColorClass(course.boatNo)">{{course.boatNo}}</div>
          <!--ボートのイメージ-->
          <div class="ml-10 mr-10 border-r-blue-500 border-l-blue-500 border-r border-l h-full flex flex-col justify-center items-end">
            <img 
              src="/assets/images/boat.png" 
              alt="ボート" 
              class="w-[15%] h-auto"
              [style.marginRight]="startPosition(course.value)"
            >
          </div>
          <div class="w-40">{{course.value}}</div>
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
  @Input() startFormationFg!: StartingFormationFormGroup;

  //艇番表示色取得クラス
  getBoatColorClass = getBoatColorClass;

  constructor(
    //public fg: PredictionFormService, 
  ) { }

  ngOnInit(): void {
    //開発用、処理が固まったら以下は削除。
    //this.fg.startExhibition.initialize();
    if (!this.startFormationFg.boats[0].value) {
      this.startFormationFg.setSt(1, 1, 0.2);
      this.startFormationFg.setSt(2, 2, 0.13);
      this.startFormationFg.setSt(3, 3, -0.05);
      this.startFormationFg.setSt(4, 4, 0.19);
      this.startFormationFg.setSt(5, 5, 0.04);
      this.startFormationFg.setSt(6, 6, 0.09);
    }
  }

  drop(event: CdkDragDrop<StartingBoatFormControl[]>) {
    moveItemInArray(
      this.startFormationFg.boatsArray.controls, 
      event.previousIndex, 
      event.currentIndex, 
    )
  }

  startPosition(st: number | null): string {
    if (st === null) {
      return `100%`;
    } else {
      return `${100 * st}%`;
    }
  }
}
