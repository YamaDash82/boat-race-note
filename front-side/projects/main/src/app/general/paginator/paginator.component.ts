import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-paginator',
  template: `
    <div class="flex items-center">
      <button 
        mat-button
        type="button" 
        class="block mr-2"
        [disabled]="!hasPrevious()"
        (click)="previous()"
      >&lt;</button>
      {{currentIndex + 1}}/{{items.length}}
      <button 
        mat-button
        type="button" 
        class="block ml-2"
        [disabled]="!hasNext()"
        (click)="next()"
      >&gt;</button>
    </div>
  `,
  styles: [
  ]
})
export class PaginatorComponent {
  //当ページネーターで制御する値の集合体。
  items: any[] = [];

  /**
   * 集合体セッター
   * 親コンポーネントから集合体をセットする。
   */
  @Input() set aggregate(items: any[]) {
    this.items = items;
    if (this.items.length > 0) {
      this.currentIndex = 0;
    } else {
      this.currentIndex = -1;
    }
  };
  
  //カレントインデックス
  currentIndex!: number;

  /**
   * 移動後イベント
   */
  @Output() moved = new EventEmitter<any>();

  /**
   * 前データ有無
   * @returns 
   */
  hasPrevious(): boolean {
    if (this.items.length === 0 ) return false;

    return !(this.currentIndex <= 0);
  }

  /**
   * 次データ有無
   * @returns 
   */
  hasNext(): boolean {
    if (this.items.length === 0 ) return false;

    return this.currentIndex !== (this.items.length - 1);
  }
  
  /**
   * 戻る処理
   * @returns 
   */
  previous() {
    //集合体に要素がないとき処理を中断する。
    if (!this.items.length) return;

    this.moved.emit(this.items[--this.currentIndex])
  }

  /**
   * 進む処理
   * @returns 
   */
  next() {
    //集合体に要素がないとき処理を中断する。
    if (!this.items.length) return;

    this.moved.emit(this.items[++this.currentIndex]);
  }

  /**
   * 終端移動処理
   * @returns 
   */
  moveLast() {
    //集合体に要素がないとき処理を中断する。
    if (this.items.length === 0) return;

    this.currentIndex = this.items.length - 1;

    this.moved.emit(this.items[this.currentIndex]);
  }
}
