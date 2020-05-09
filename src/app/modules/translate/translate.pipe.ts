import { Pipe, PipeTransform } from '@angular/core';

import { TranslateService } from './translate.service';

/**
 * Translate pipe.
 */
@Pipe({
  name: 'translate',
  pure: false, // this should be set to false fro values to be updated on language change
})
export class TranslatePipe implements PipeTransform {
  constructor(private readonly translate: TranslateService) {}

  public transform(value: string): string {
    if (!Boolean(value)) {
      return;
    }
    return this.translate.instant(value);
  }
}
