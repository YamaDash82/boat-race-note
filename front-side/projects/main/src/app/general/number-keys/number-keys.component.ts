import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-number-keys',
  template: `
    <div clas="flex flex-col">
      <div *ngFor="let buttons of numberButtons" class="flex">
        <div *ngFor="let button of buttons" class="h-32 p-1">
          <button 
            type="button"
            class="appearance-none h-full w-32 text-8xl rounded-sm text-white"
            [class.bg-slate-500]="button.buttonType===1"
            [class.bg-rose-400]="button.buttonType!==1"
            (click)="someKeyClick(button.buttonType, button.caption)"
            >{{button.caption}}</button>
        </div>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class NumberKeysComponent {
  numberButtons: { caption: string, buttonType: number }[][] = [
    [ { caption: '7', buttonType: 1 },{ caption: '8', buttonType: 1 }, { caption: '9', buttonType: 1 } ],
    [ { caption: '4', buttonType: 1 },{ caption: '5', buttonType: 1 }, { caption: '6', buttonType: 1 } ],
    [ { caption: '1', buttonType: 1 },{ caption: '2', buttonType: 1 }, { caption: '3', buttonType: 1 } ],
    [ { caption: '0', buttonType: 1 },{ caption: 'C', buttonType: 2 }, { caption: 'AC', buttonType: 3 } ],
  ]

  @Output() numClick = new EventEmitter<string>();
  @Output() clearClcik = new EventEmitter<void>();
  @Output() allClearClick = new EventEmitter<void>();

  someKeyClick(buttonType: number, numStr?: string):void {
    if (buttonType === 1) {
      //ナンバーボタン押下時の処理
      this.numClick.emit(numStr);
    } else if(buttonType === 2) {
      //Cボタン（クリアボタン）謳歌時の処理
      this.clearClcik.emit();
    } else {
      //ACボタン（オールクリアボタン謳歌時の処理）
      this.allClearClick.emit();
    }
  }
}
