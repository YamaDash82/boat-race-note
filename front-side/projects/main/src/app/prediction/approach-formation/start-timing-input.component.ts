import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { StartTiming } from 'projects/main/src/app/common/utilities';

@Component({
  selector: 'app-start-timing-input',
  template: `
    <h1 mat-dialog-title>スタートタイミング入力</h1>
    <div
      class="flex flex-col"
      mat-dialog-content
    >
      <div>小数点以下２桁の数値を入力。フライングはマイナス値を入力する。</div>
      <input type="number" [formControl]="startTiming">
    </div>
    <div
      class="flex justify-between"
      mat-dialog-actions
    >
      <div>
        <button type="button" mat-button mat-dialog-close>キャンセル</button>
      </div>
      <div>
        <button type="button" mat-button mat-dialog-close (click)="enterStartTiming()">確定</button>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class StartTimingInputComponent implements OnInit {
  //フライングフラグ フライング時True
  isFlying = false;

  //仮のスタートタイミング入力用FormControl
  startTiming = new FormControl<number | null>(null);

  constructor(
    public dialogRef: MatDialogRef<StartTimingInputComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: number, 
  ) { }

  ngOnInit(): void {
    
  }

  enterStartTiming() {
    /*
    this.dialogRef.close({
      data: new StartTiming(0.15)
    });
    */
    if (this.startTiming.value === null) {
      this.dialogRef.close(null);
    } else {
      const st = new StartTiming(this.startTiming.value);
      this.dialogRef.close(st);
    }
  }
}
