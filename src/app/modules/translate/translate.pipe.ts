import { Pipe, PipeTransform } from '@angular/core';

import { DnbhubTranslateService } from './translate.service';

/**
 * Translate pipe.
 */
@Pipe({
  name: 'translate',
  // eslint-disable-next-line @angular-eslint/no-pipe-impure
  pure: false, // this should be set to false fro values to be updated on language change
})
export class DnbhubTranslatePipe implements PipeTransform {
  constructor(private readonly translate: DnbhubTranslateService) {}

  public transform(value: string): string {
    if (!Boolean(value)) {
      return;
    }
    return this.translate.instant(value);
  }
}
