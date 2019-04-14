import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { CustomHttpHandlersService } from 'src/app/services/custom-http-handlers/custom-http-handlers.service';

import { Observable } from 'rxjs';
import { timeout, take, map, catchError } from 'rxjs/operators';

/**
 * Email submission service.
 */
@Injectable()
export class EmailSubmissionService {

  constructor(
    private http: HttpClient,
    private handlers: CustomHttpHandlersService,
    @Inject('Window') private window: Window
  ) {
    console.log('EmailSubmissionService constructor');
  }

  /**
   * Mailing list subscription endpoint.
   */
  private endpoint: string = this.window.location.origin + '/submitBlogPostOverEmail';

  /**
   * Submits blog post over email.
   * TODO: debug this request
   */
  public submitBlogPost(formData: { email: string, soundcloudPlaylistLink: string, domain: string }): Observable<any[]> {
    const params: HttpParams = new HttpParams()
      .append('email', formData.email)
      .append('link', formData.soundcloudPlaylistLink)
      .append('domain', formData.domain);
    const headers: HttpHeaders = new HttpHeaders()
      .append('Content-type', 'application/x-www-form-urlencoded');
    const options: any = { headers, params };
    return this.http.post(this.endpoint, formData, options).pipe(
      timeout(this.handlers.timeoutValue()),
      take(1),
      map(this.handlers.extractObject),
      catchError(this.handlers.handleError)
    );
  }

}
