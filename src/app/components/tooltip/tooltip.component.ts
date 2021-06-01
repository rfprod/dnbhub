import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';

import { ITooltipData, TOOLTIP_DATA } from './tooltip.interface';

@Component({
  selector: 'dnbhub-tooltip',
  template: `
    <div class="dnbhub-tooltip">
      <small class="dnbhub-tooltip__text">{{ data.text }}</small>
    </div>
  `,
  styleUrls: ['./tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DnbhubTooltipComponent {
  constructor(@Inject(TOOLTIP_DATA) public readonly data: ITooltipData) {}
}
