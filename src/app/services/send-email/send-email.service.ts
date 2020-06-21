import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { IEmailFormValue } from 'src/app/interfaces';
import { DnbhubHttpHandlersService } from 'src/app/services/http-handlers/http-handlers.service';
import { WINDOW } from 'src/app/utils';

/**
 * Send email service.
 */
@Injectable({
  providedIn: 'root',
})
export class SendEmailService {
  constructor(
    private readonly http: HttpClient,
    private readonly handlers: DnbhubHttpHandlersService,
    @Inject(WINDOW) private readonly window: Window,
  ) {}

  private readonly endpoint: string = this.window.location.origin + '/sendEmail';

  public sendEmail(formData: IEmailFormValue) {
    return this.handlers.pipeHttpRequest<{ success: string }>(
      this.http.post<{ success: string }>(this.endpoint, formData),
    );
  }
}
