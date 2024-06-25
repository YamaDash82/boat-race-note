import { Component } from '@angular/core';
import { PredictionFormService } from '../prediction-form.service';

@Component({
  selector: 'app-exhibition',
  template: `
    <div class="h-[80vh] w-full flex">
      <app-approach-formation 
        [startFormationFg]="fg.startExhibition" 
        class="w-[70%]"
        caption="スタート展示"
      ></app-approach-formation>
      <app-sailing-exhibition class="w-[30%]"></app-sailing-exhibition>
    </div>
  `,
  styles: [
  ]
})
export class ExhibitionComponent {
  constructor(
    public fg: PredictionFormService, 
  ) { }
}
