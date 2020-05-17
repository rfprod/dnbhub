import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, take, timeout } from 'rxjs/operators';
import { HttpProgressService } from 'src/app/state/http-progress/http-progress.service';
import { ETIMEOUT } from 'src/app/utils';

/**
 * Custom http handlers service.
 */
@Injectable()
export class HttpHandlersService {
  private readonly defaultHttpTimeout = 10000;

  constructor(
    private readonly httpProgress: HttpProgressService,
    private readonly snackBar: MatSnackBar,
  ) {}

  private displayErrorToast(error: string): void {
    this.snackBar.open(error, null, {
      duration: ETIMEOUT.MEDUIM,
    });
  }

  public getErrorMessage(error: HttpErrorResponse & firebase.FirebaseError): string {
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
  public handleError(error: HttpErrorResponse & firebase.FirebaseError): Observable<never> {
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
