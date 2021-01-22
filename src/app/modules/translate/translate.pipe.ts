import { Pipe, PipeTransform } from '@angular/core';

import { DnbhubTranslateService } from './translate.service';

/**
 * Translate pipe.
 */
@Pipe({
  name: 'translate',
  pure: false,
})
export class DnbhubTranslatePipe implements PipeTransform {
  constructor(private readonly translate: DnbhubTranslateService) {}

  public transform(value: string): string {
    if (!Boolean(value)) {
      return value;
    }
    return this.translate.instant(value);
  }
}
