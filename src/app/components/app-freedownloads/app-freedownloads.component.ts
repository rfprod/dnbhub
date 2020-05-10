import { Component, HostBinding } from '@angular/core';
/**
 * Application free downloads component.
 */
@Component({
  selector: 'app-freedownloads',
  templateUrl: './app-freedownloads.component.html',
  styleUrls: ['./app-freedownloads.component.scss'],
  host: {
    class: 'mat-body-1',
  },
})
export class AppFreedownloadsComponent {
  @HostBinding('fxFlex') public fxFlex = '1 1 auto';
  @HostBinding('fxLayout') public fxLayout = 'row';
  @HostBinding('fxLayoutAlign') public fxLayoutAlign = 'start stretch';
}
