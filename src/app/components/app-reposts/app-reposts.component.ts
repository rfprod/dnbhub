import { Component, HostBinding } from '@angular/core';

/**
 * Application free downloads component.
 */
@Component({
  selector: 'app-reposts',
  templateUrl: './app-reposts.component.html',
  styleUrls: ['./app-reposts.component.scss'],
  host: {
    class: 'mat-body-1',
  },
})
export class AppRepostsComponent {
  @HostBinding('fxFlex') public fxFlex = '1 1 auto';
  @HostBinding('fxLayout') public fxLayout = 'row';
  @HostBinding('fxLayoutAlign') public fxLayoutAlign = 'start stretch';
}
