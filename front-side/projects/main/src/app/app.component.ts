import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { UsersModel } from '../generated/graphql';

@Component({
  selector: 'app-root',
  template: `
    <header class="h-[5vh] w-full bg-red-500 flex justify-between">
      <div>{{title}}</div>
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
  title = 'main';
  loginUser: UsersModel | null = null;

  constructor(
    private auth: AuthService, 
  ) { }

  ngOnInit(): void {
    this.auth.loginStateChange$.subscribe(user => {
      this.loginUser = user;
    });
  }
}
