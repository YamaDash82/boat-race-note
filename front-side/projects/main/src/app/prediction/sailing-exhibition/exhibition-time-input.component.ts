import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-exhibition-time-input',
  template: `
    <h1 mat-dialog-title>展示タイム入力</h1>
    <div 
      class="flex flex-col"
      mat-dialog-content
    >
      <div>小数点以下２桁の数値を入力</div>
      <input type="number" [formControl]="exhibitionTime">
    </div>
    <div
      class="flex justify-between"
      mat-dialog-actions
    >
      <div>
        <button type="button" mat-button mat-dialog-close>キャンセル</button>
      </div>
      <div>
        <button type="button" mat-button mat-dialog-close (click)="enterExhibitionTime()">確定</button>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class ExhibitionTimeInputComponent implements OnInit {
  exhibitionTime = new FormControl<number | null>(null);

  constructor(
    public dialogRef: MatDialogRef<ExhibitionTimeInputComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: number | null, 
  ) { }

  ngOnInit(): void {
    
  }

  enterExhibitionTime() {
    this.dialogRef.close(this.exhibitionTime.value);
  }
}
