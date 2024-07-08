import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  template: `
    <form 
      submit="return false;" 
      class="h-full w-full flex flex-col items-center text-4xl"
      [formGroup]="fg"
    >
      <div class="w-2/3 mt-20">
        <mat-form-field class="w-full">
          <mat-label>ユーザーID</mat-label>
          <input type="text" matInput [formControl]="fg.userId">
        </mat-form-field>
      </div>
      <div class="w-2/3 mt-5">
        <mat-form-field class="w-full">
          <mat-label>パスワード</mat-label>
          <input type="password" matInput [formControl]="fg.password">
        </mat-form-field>
      </div>
      <div class="w-2/3 text-red-500">
        {{errorMessage}}
      </div>
      <div class="w-2/3 mt-5">
        <button 
          mat-raised-button 
          class="w-full"
          color="primary"
          type="button"
          [disabled]="fg.invalid"
          (click)="login()"
        >ログイン</button>
      </div>
      <div class="w-2/3 text-2xl mt-5 text-right">
        <button 
          class="text-blue-700"
          (click)="transToAppendUser()"
          type="button"
        >アカウント登録画面はこちら</button>
      </div>
      <div class="w-2/3 text-2xl mt-5 text-right">
        <button 
          class="text-blue-700"
          (click)="transToPrediction()"
          type="button"
        >ログインせずに使用する</button>
      </div>
    </form>
  `,
  styles: []
})
export class LoginComponent {
  fg = new LoginFormGroup();
  errorMessage="";

  constructor(
    private auth: AuthService, 
    private router: Router, 
  ) { }
  
  async login() {
    //エラーメッセージを初期化する。
    this.errorMessage = "";
    
    try {
      await this.auth.login(this.fg.userId.value as string, this.fg.password.value as string );
      
      this.router.navigate(['/prediction']);
    } catch(err) {
      this.errorMessage = err instanceof Error ? err.message : 'ログイン処理中にエラーが発生しました。';
    }
  }

  /**
   * アカウント登録画面遷移
   */
  transToAppendUser() {
    this.router.navigate(['auth', 'append-user']);
  }

  transToPrediction() {
    this.router.navigate(['']);
  }
}

class LoginFormGroup extends FormGroup {
  constructor() {
    super({
      userId: new FormControl<string | null>(null, Validators.required), 
      password: new FormControl<string | null>(null, Validators.required),
    });
  }

  get userId(): FormControl<string | null> { return this.controls['userId'] as FormControl<string | null>; }
  get password(): FormControl<string | null> { return this.controls['password'] as FormControl<string | null>; }
}