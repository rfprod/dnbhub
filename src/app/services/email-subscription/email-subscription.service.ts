import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, take, timeout } from 'rxjs/operators';
import { CustomHttpHandlersService } from 'src/app/services/custom-http-handlers/custom-http-handlers.service';

/**
 * Email subscription service.
 */
@Injectable()
export class EmailSubscriptionService {
  constructor(
    private readonly http: HttpClient,
    private readonly handlers: CustomHttpHandlersService,
    @Inject('Window') private readonly window: Window,
  ) {
    console.warn('EmailSubscriptionService constructor');
  }

  /**
   * Mailing list subscription endpoint.
   */
  private readonly endpoint: string = this.window.location.origin + '/saveEmailSubscription';

  /**
   * Sends mailing list subscription request.
   */
  public subscribe(formData: { email: string; domain: string }): Observable<any[]> {
    return this.http
      .post(this.endpoint, formData)
      .pipe(
        timeout(this.handlers.timeoutValue()),
        take(1),
        map(this.handlers.extractObject),
        catchError(this.handlers.handleError),
      );
  }
}
