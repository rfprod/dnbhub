import { Pipe, PipeTransform } from '@angular/core';

/**
 * Map to iterable pipe.
 */
@Pipe({
  name: 'mapToIterable',
  // eslint-disable-next-line @angular-eslint/no-pipe-impure
  pure: false,
})
export class DnbhubMapToIterablePipe implements PipeTransform {
  /**
   * Retrieves map keys to iterable array.
   * @param value object
   * @param args arguments array
   */
  public transform(value: Record<string, unknown>): string[] {
    if (!Boolean(value)) {
      return;
    }
    return Object.keys(value);
  }
}
