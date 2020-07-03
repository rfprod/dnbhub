import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { WINDOW } from '../../utils/injection-tokens';
import { DnbhubHttpHandlersService } from '../http-handlers/http-handlers.service';

/**
 * Email submission service.
 */
@Injectable({
  providedIn: 'root',
})
export class DnbhubEmailSubmissionService {
  constructor(
    private readonly http: HttpClient,
    private readonly handlers: DnbhubHttpHandlersService,
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
