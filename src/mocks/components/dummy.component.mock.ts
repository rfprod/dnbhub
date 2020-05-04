import { Component } from '@angular/core';

/**
 * @note
 * div autoscroll should be present for Autoscroll directive testing
 * input with autofocus attribute is needed for Autofocus directive testing
 */
@Component({
  selector: 'app-dummy-component',
  template: '<div appAutoscroll class="scrollable"><input autofocus="true" appAutofocus /></div>',
  styles: [
    `
      .scrollable {
        display: block;
        min-height: 50px;
        height: 50px;
        max-height: 50px;
        overflow-y: scroll;
      }
    `,
  ],
})
export class DummyComponent {}
