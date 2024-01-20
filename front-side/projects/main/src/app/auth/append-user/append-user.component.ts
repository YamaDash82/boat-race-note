import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UserDto } from '@common_modules/data-transfer/user';
import { passwordConfig } from '@common_modules/utilities/password';
import { Router } from '@angular/router';

@Component({
  selector: 'app-append-user',
  template: `
    <form 
      submit="return false;"
      class="h-full w-full flex flex-col items-center"
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
          <mat-hint *ngIf="fg.password.untouched">{{passwordConfig.hintMessage}}</mat-hint>
          <mat-error *ngIf="fg.touched && fg.password.errors?.['pattern']">{{passwordConfig.errorMessage}}</mat-error>
        </mat-form-field>
      </div>
      <div class="w-2/3 mt-5">
        <mat-form-field class="w-full">
          <mat-label>パスワード(確認)</mat-label>
          <input type="password" matInput [formControl]="fg.passwordConfim">
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
          (click)="register()"
        >登録</button>
      </div>
    </form>
  `,
  styles: []
})
export class AppendUserComponent {
  fg = new AppendUserFormGroup();
  //下記はテンプレートでpasswordConfigを使用するために必要。
  passwordConfig = passwordConfig;

  errorMessage = "";

  constructor(
    private auth: AuthService, 
    private router: Router, 
  ) { }

  /**
   * 登録処理
   */
  async register() {
    this.errorMessage = "";

    if (this.fg.password.value !== this.fg.passwordConfim.value) {
      this.errorMessage = `パスワードとパスワード(確認)が一致しません。`;
      return;
    }

    try {
      await this.auth.registerNewUser(this.fg.toDto());
      
      //ユーザー登録成功後、メイン画面に遷移する。
      this.router.navigate(['/prediction']);
    } catch(err) {
      this.errorMessage = err instanceof Error ? err.message : `新規ユーザー登録処理中にエラーが発生しました。`;
    }
  }
}

class AppendUserFormGroup extends FormGroup {
  constructor() {
    super({
      userId: new FormControl<string | null>(null, Validators.required),
      password: new FormControl<string | null>(
        null, 
        [Validators.required, Validators.pattern(passwordConfig.pattern)]
      ), 
      passwordConfirm: new FormControl<string | null>(null, Validators.required), 
    });
  }

  get userId(): FormControl<string | null> { return this.controls['userId'] as FormControl<string | null>; }
  get password(): FormControl<string | null> { return this.controls['password'] as FormControl<string | null>; }
  get passwordConfim(): FormControl<string | null> { return this.controls['passwordConfirm'] as FormControl<string | null>; }

  toDto(): UserDto.Request.AppendUser {
    return {
      key: this.userId.value as string, 
      password: this.password.value as string, 
    };
  }
}