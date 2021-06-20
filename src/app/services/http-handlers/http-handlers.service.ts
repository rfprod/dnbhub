import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import firebase from 'firebase';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, take, timeout } from 'rxjs/operators';

import { DnbhubHttpProgressService } from '../../state/http-progress/http-progress.service';

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
    const duration = 1000;
    this.snackBar.open(errorMessage, void 0, {
      duration,
    });
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
