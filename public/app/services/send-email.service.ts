import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CustomHttpHandlersService } from './custom-http-handlers.service';

import { Observable } from 'rxjs';
import { timeout, take, map, catchError } from 'rxjs/operators';

/**
 * Send email service.
 */
@Injectable()
export class SendEmailService {

  constructor(
    private http: HttpClient,
    private handlers: CustomHttpHandlersService,
    @Inject('Window') private window: Window
  ) {
    console.log('SendEmailService constructor');
  }

  /**
   * Send email endpoint.
   */
  private endpoint: string = this.window.location.origin + '/sendEmail';

  /**
   * Sends email.
   */
  public sendEmail(formData: { name: string, email: string, header: string, message: string, domain: string }): Observable<any> {
    return this.http.post(this.endpoint, formData).pipe(
      timeout(this.handlers.timeoutValue()),
      take(1),
      map(this.handlers.extractObject),
      catchError(this.handlers.handleError)
    );
  }

}
