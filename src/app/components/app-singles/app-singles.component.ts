import { Component, HostBinding } from '@angular/core';

/**
 * Application singles component.
 */
@Component({
  selector: 'app-singles',
  templateUrl: './app-singles.component.html',
  styleUrls: ['./app-singles.component.scss'],
  host: {
    class: 'mat-body-1',
  },
})
export class AppSinglesComponent {
  @HostBinding('fxFlex') public fxFlex = '1 1 auto';
  @HostBinding('fxLayout') public fxLayout = 'row';
  @HostBinding('fxLayoutAlign') public fxLayoutAlign = 'start stretch';
}
