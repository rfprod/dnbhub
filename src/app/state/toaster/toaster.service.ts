import { Injectable, Provider } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

import { toasterExtraClasses, TToasterExtraClasses, TToastType } from './toaster.interface';

/**
 * Toaster service for user feedback.
 * Use to notify user about server responses in human readable format.
 * Usage example:
 * this.toaster.showToaster(error, 'error', 5000);
 */
@Injectable({
  providedIn: 'root',
})
export class DnbhubToasterService {
  private snackBarRef?: MatSnackBarRef<SimpleSnackBar>;

  private readonly defaultDuration = 7000;

  constructor(private readonly snackBar: MatSnackBar) {}

  /**
   * Shows snackbar.
   * @param message text message to be displayed
   * @param type event type, colorizes snackbar
   * @param duration snackbar visibility duration in milliseconds
   */
  public showToaster(message: string, type: TToastType = 'primary', duration?: number): void {
    const ec: TToasterExtraClasses = toasterExtraClasses(type);
    this.snackBarRef = this.snackBar.open(message, void 0, {
      panelClass: ec,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      duration: duration ?? this.defaultDuration,
    });
  }

  public hideToaster(): void {
    if (typeof this.snackBarRef !== 'undefined') {
      this.snackBarRef.dismiss();
    }
  }
}

export const toasterServiceProvider: Provider = {
  provide: DnbhubToasterService,
  useFactory: (snackBar: MatSnackBar) => new DnbhubToasterService(snackBar),
  deps: [MatSnackBar],
};
