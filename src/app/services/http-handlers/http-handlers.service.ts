import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, take, timeout } from 'rxjs/operators';
import { DnbhubHttpProgressService } from 'src/app/state/http-progress/http-progress.service';
import { TIMEOUT } from 'src/app/utils';

/**
 * Custom http handlers service.
 */
@Injectable({
  providedIn: 'root',
})
export class DnbhubHttpHandlersService {
  private readonly defaultHttpTimeout = 10000;

  constructor(
    private readonly httpProgress: DnbhubHttpProgressService,
    private readonly snackBar: MatSnackBar,
  ) {}

  private displayErrorToast(error: string): void {
    this.snackBar.open(error, void 0, {
      duration: TIMEOUT.MEDUIM,
    });
  }

  public getErrorMessage(error: HttpErrorResponse & firebase.default.FirebaseError): string {
    const msg: string = Boolean(error.message)
      ? error.message
      : Boolean(error.code)
      ? error.code
      : error.error;
    const errorMessage: string = Boolean(msg)
      ? msg
      : Boolean(error.status)
      ? `${error.status} - ${error.statusText}`
      : 'Server error';
    return errorMessage;
  }

  /**
   * Handles error.
   * @param error error object
   */
  public handleError(error: HttpErrorResponse & firebase.default.FirebaseError): Observable<never> {
    const errorMessage = this.getErrorMessage(error);
    this.displayErrorToast(errorMessage);
    return throwError(errorMessage);
  }

  /**
   * Pipes request with object response.
   * @param observable request observable
   */
  public pipeHttpRequest<T>(observable: Observable<T>): Observable<T> {
    this.httpProgress.handlers.mainView.start();
    return observable.pipe(
      timeout(this.defaultHttpTimeout),
      take(1),
      catchError(error => this.handleError(error)),
      finalize(() => {
        this.httpProgress.handlers.mainView.stop();
      }),
    );
  }
}
