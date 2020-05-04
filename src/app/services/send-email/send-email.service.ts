import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, take, timeout } from 'rxjs/operators';
import { CustomHttpHandlersService } from 'src/app/services/custom-http-handlers/custom-http-handlers.service';

/**
 * Send email service.
 */
@Injectable()
export class SendEmailService {
  constructor(
    private readonly http: HttpClient,
    private readonly handlers: CustomHttpHandlersService,
    @Inject('Window') private readonly window: Window,
  ) {
    console.warn('SendEmailService constructor');
  }

  /**
   * Send email endpoint.
   */
  private readonly endpoint: string = this.window.location.origin + '/sendEmail';

  /**
   * Sends email.
   */
  public sendEmail(formData: {
    name: string;
    email: string;
    header: string;
    message: string;
    domain: string;
  }): Observable<any> {
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
