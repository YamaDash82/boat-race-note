import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { UsersModel } from '../generated/graphql';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  template: `
    <header class="h-[5vh] w-full bg-red-500 flex justify-between items-center text-4xl">
      <div>ボートレース予想</div>
      <div>{{loginUser?.key}}</div>
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

  constructor(
    private swUpdate: SwUpdate, 
    private auth: AuthService, 
  ) { }

  async ngOnInit(): Promise<void> {
    //新しいバージョンのリリースをチェックする。
    if (await this.swUpdate.checkForUpdate()) { 
      //新しいバージョンがあればリロードする。
      document.location.reload();
    }

    this.auth.loginStateChange$.subscribe(user => {
      this.loginUser = user;
    });
  }
}