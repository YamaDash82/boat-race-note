import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-paginator',
  template: `
    <div class="flex items-center text-2xl">
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
  @Output() moved = new EventEmitter<{ index: number; data: any }>();

  /**
   * 移動前イベント
   * 移動ボタンクリックを検知するのに使用する。
   */
  @Output() beforeMove = new EventEmitter<void>();

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

    //移動前イベントを発火する。
    this.beforeMove.emit();

    //インデックスを移動する。
    this.currentIndex--;

    //移動先の要素を返す。
    this.moved.emit({ 
      index: this.currentIndex, 
      data: this.items[this.currentIndex]
    });
  }

  /**
   * 進む処理
   * @returns 
   */
  next() {
    //集合体に要素がないとき処理を中断する。
    if (!this.items.length) return;

    //移動前イベントを発火する。
    this.beforeMove.emit();

    //インデックスを移動する。
    this.currentIndex++;

    //移動先の要素を返す。
    this.moved.emit({
      index: this.currentIndex, 
      data: this.items[this.currentIndex]
    });
  }

  /**
   * 指定位置移動処理
   * @param index 
   * @param cancel イベント発火をキャンセルするときに指定する。
   */
  moveAt(index: number, cancel: { cancelBeforeMove: boolean, cancelMoved: boolean }): void;
  /**
   * 指定位置移動処理
   * @param index 
   */
  moveAt(index: number): void;
  moveAt(index: number, cancel?: any) {
    if (index < 0 || index > (this.items.length - 1)) throw new Error('インデックスの指定が不正です。');

    if (cancel && cancel.cancelBeforeMove) { 
      //移動前処理イベントを発火をキャンセルする。
    } else {
      //移動前イベントを発火する。
      this.beforeMove.emit();
    }

    //インデックスを更新する。
    this.currentIndex = index;
    
    if (cancel && cancel.cancelMoved) {
      //移動後イベント発火をキャンセルする。
    } else {
      //該当する要素を返す。
      this.moved.emit({ 
        index: this.currentIndex, 
        data: this.items[this.currentIndex]
      });
    }
  }

  /**
   * 終端移動処理
   * @returns 
   */
  moveLast() {
    //集合体に要素がないとき処理を中断する。
    if (this.items.length === 0) return;

    //移動前イベントを発火する。
    this.beforeMove.emit();

    this.currentIndex = this.items.length - 1;

    this.moved.emit({
      index: this.currentIndex, 
      data: this.items[this.currentIndex]
    });
  }

  /**
   * 調整処理 
   */
  adjust() {
    if (!this.items.length) {
      //集合体に要素がなければ、カレントインデックスを-1にする。
      this.currentIndex = -1;
    } else if ((this.currentIndex + 1) >= this.items.length) {
      //カレントインデックスが集合体の要素を超えている場合、集合体の末を指すインデックスにする。
      this.currentIndex = (this.items.length - 1);
    }

    this.moved.emit({
      index: this.currentIndex, 
      data: this.items[this.currentIndex] //要素がなければundefinedが返されることを期待。
    });
  }
}