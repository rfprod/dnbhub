import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, take, timeout } from 'rxjs/operators';
import { CustomHttpHandlersService } from 'src/app/services/custom-http-handlers/custom-http-handlers.service';

/**
 * Email submission service.
 */
@Injectable()
export class EmailSubmissionService {
  constructor(
    private readonly http: HttpClient,
    private readonly handlers: CustomHttpHandlersService,
    @Inject('Window') private readonly window: Window,
  ) {
    console.warn('EmailSubmissionService constructor');
  }

  /**
   * Mailing list subscription endpoint.
   */
  private readonly endpoint: string = this.window.location.origin + '/submitBlogPostOverEmail';

  /**
   * Submits blog post over email.
   * TODO: debug this request
   */
  public submitBlogPost(formData: {
    email: string;
    soundcloudPlaylistLink: string;
    domain: string;
  }): Observable<any[]> {
    const params: HttpParams = new HttpParams()
      .append('email', formData.email)
      .append('link', formData.soundcloudPlaylistLink)
      .append('domain', formData.domain);
    const headers: HttpHeaders = new HttpHeaders().append(
      'Content-type',
      'application/x-www-form-urlencoded',
    );
    const options: any = { headers, params };
    return this.http
      .post(this.endpoint, formData, options)
      .pipe(
        timeout(this.handlers.timeoutValue()),
        take(1),
        map(this.handlers.extractObject),
        catchError(this.handlers.handleError),
      );
  }
}
