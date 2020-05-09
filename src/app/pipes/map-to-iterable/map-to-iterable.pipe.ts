import { Pipe, PipeTransform } from '@angular/core';

/**
 * Map to iterable pipe.
 */
@Pipe({
  name: 'mapToIterable',
  pure: false,
})
export class MapToIterablePipe implements PipeTransform {
  /**
   * Retrieves map keys to iterable array.
   * @param value object
   * @param args arguments array
   */
  public transform(value: object): string[] {
    if (!value) {
      return;
    }
    return Object.keys(value);
  }
}
