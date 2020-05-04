import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Application spinner service.
 */
@Injectable()
export class AppSpinnerService {
  /**
   * Indicates if application spinner should be shown.
   */
  private readonly showSpinner: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /**
   * Show application spinner observable.
   */
  public showSpinner$: Observable<boolean> = this.showSpinner.asObservable();

  /**
   * Starts spinner.
   */
  public startSpinner(): void {
    this.showSpinner.next(true);
  }

  /**
   * Stops spinner.
   */
  public stopSpinner(): void {
    this.showSpinner.next(false);
  }
}
