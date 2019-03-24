import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from './translate.service';

/**
 * Translate pipe.
 */
@Pipe({
  name: 'translate',
  pure: false // this should be set to false fro values to be updated on language change
})
export class TranslatePipe implements PipeTransform {

  constructor(
    private translate: TranslateService
  ) {}

  public transform(value: string, args: any[]): any {
    if (!value) { return; }
    return this.translate.instant(value);
  }

}
