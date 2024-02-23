import { Component } from '@angular/core';

@Component({
  selector: 'app-exhibition',
  template: `
    <div class="h-[80vh] w-full flex">
      <app-start-exhibition class="w-[70%]"></app-start-exhibition>
      <app-sailing-exhibition class="w-[30%]"></app-sailing-exhibition>
    </div>
  `,
  styles: [
  ]
})
export class ExhibitionComponent {

}
