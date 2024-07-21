import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { UsersModel } from '../generated/graphql';
import { SwUpdate } from '@angular/service-worker';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  template: `
    <header class="h-[5vh] w-full bg-red-500 flex justify-between items-center text-4xl">
      <div class="ml-2 flex items-end">
        <img src="./assets/images/logo.png" alt="ロゴ" class="inline-block h-[4vh] mr-2">
        <span class="block text-2xl">{{appVersion}}</span>
      </div>
      <div class="mr-2 flex items-center" *ngIf="loginUser; else notLogin">
        <button
          type="button"
          mat-icon-button
          [matMenuTriggerFor]="accountMenu"
        >
          <mat-icon>person</mat-icon>
        </button>
        <mat-menu #accountMenu="matMenu">
          <button 
            type="button"
            mat-menu-item
            (click)="logout()"
          >
            <mat-icon>logout</mat-icon>
            <span class="text-2xl">ログアウト</span>
          </button>
        </mat-menu>
        <div>{{loginUser.key}}</div>
      </div>
      <ng-template #notLogin>
        <div
          class="ml-auto text-xl text-slate-600"
        >
          未ログイン状態です。ログインすると、予想情報を保存できるようになります。
        </div>
        <a href="#" 
          class="mr-2"
          routerLink="/auth/login"
          mat-icon-butto
        ><mat-icon>login</mat-icon></a>
      </ng-template>
    </header>
    <main class="h-[90vh] w-full bg-slate-300">
      <router-outlet></router-outlet>
    </main>
    <footer class="h-[5vh] w-full bg-slate-800">
      Fotter
    </footer>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  loginUser: UsersModel | null = null;
  appVersion = environment.appVersion;

  constructor(
    private swUpdate: SwUpdate, 
    private auth: AuthService, 
    private router: Router, 
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      //新しいバージョンのリリースをチェックする。
      if (await this.swUpdate.checkForUpdate()) { 
        //新しいバージョンがあればリロードする。
        document.location.reload();
      }
    } catch(err) {
      console.error(`新しいバージョンチェック処理中にエラー発生。${err instanceof Error ? err.message : ''}`);
    }

    this.auth.loginStateChange$.subscribe(user => {
      this.loginUser = user;
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['auth', 'login']);
  }
}