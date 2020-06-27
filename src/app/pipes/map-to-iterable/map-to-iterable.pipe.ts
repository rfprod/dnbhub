import { Pipe, PipeTransform } from '@angular/core';

/**
 * Map to iterable pipe.
 */
@Pipe({
  name: 'mapToIterable',
})
export class DnbhubMapToIterablePipe implements PipeTransform {
  /**
   * Retrieves map keys to iterable array.
   * @param value object
   */
  public transform(value: Record<string, unknown>, args: string[] = []): string[] | number[] {
    if (!Boolean(value)) {
      return;
    }
    return args[0] === 'string'
      ? Object.keys(value)
      : Object.keys(value).map(item => parseInt(item, 10));
  }
}
