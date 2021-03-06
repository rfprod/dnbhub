import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { IEmailFormValue } from '../../interfaces';
import { DnbhubHttpHandlersService } from '../../services/http-handlers/http-handlers.service';
import { WINDOW } from '../../utils';

/**
 * Send email service.
 */
@Injectable({
  providedIn: 'root',
})
export class DnbhubSendEmailService {
  constructor(
    private readonly http: HttpClient,
    private readonly handlers: DnbhubHttpHandlersService,
    @Inject(WINDOW) private readonly win: Window,
  ) {}

  private readonly endpoint: string = this.win.location.origin + '/sendEmail';

  public sendEmail(formData: IEmailFormValue) {
    return this.handlers.pipeHttpRequest<{ success: string }>(
      this.http.post<{ success: string }>(this.endpoint, formData),
    );
  }
}
