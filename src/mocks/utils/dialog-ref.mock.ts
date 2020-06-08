import { Injectable } from '@angular/core';

/**
 * Mocked material dialog.
 */
@Injectable()
export class DialogRefMock {
  public close(msg?: string): boolean {
    return true;
  }

  public hide(msg?: string): boolean {
    return true;
  }

  public updateSize(width?: string, height?: string): boolean {
    return true;
  }
}
