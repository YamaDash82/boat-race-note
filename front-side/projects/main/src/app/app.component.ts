import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <header class="h-[10vh] w-full bg-red-500">
      Header
    </header>
    <main class="h-[85vh] w-full bg-slate-300">
      <router-outlet></router-outlet>
    </main>
    <footer class="h-[5vh] w-full bg-slate-800">
      Fotter
    </footer>
  `,
  styles: []
})
export class AppComponent {
  title = 'main';
}
