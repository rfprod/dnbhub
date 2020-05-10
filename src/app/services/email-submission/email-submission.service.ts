import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpHandlersService } from 'src/app/services/http-handlers/http-handlers.service';
import { WINDOW } from 'src/app/utils';

/**
 * Email submission service.
 */
@Injectable()
export class EmailSubmissionService {
  constructor(
    private readonly http: HttpClient,
    private readonly handlers: HttpHandlersService,
    @Inject(WINDOW) private readonly window: Window,
  ) {}

  private readonly endpoint: string = this.window.location.origin + '/submitBlogPostOverEmail';

  /**
   * Submits blog post over email.
   * TODO: debug this request
   */
  public submitBlogPost(formData: {
    email: string;
    soundcloudPlaylistLink: string;
    domain: string;
  }) {
    const params: HttpParams = new HttpParams()
      .append('email', formData.email)
      .append('link', formData.soundcloudPlaylistLink)
      .append('domain', formData.domain);
    const headers: HttpHeaders = new HttpHeaders().append(
      'Content-type',
      'application/x-www-form-urlencoded',
    );
    return this.handlers.pipeHttpRequest<{ success: string }>(
      this.http.post<{ success: string }>(this.endpoint, formData, { headers, params }),
    );
  }
}
