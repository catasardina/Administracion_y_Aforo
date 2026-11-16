import { Component } from '@angular/core';
import { PanelComponent } from './panel/panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PanelComponent],
  template: '<app-panel />',
})
export class AppComponent {}
