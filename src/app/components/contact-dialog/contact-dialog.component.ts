import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';

import { IEmailForm, IEmailFormValue } from '../../interfaces/forms/email-form.interface';
import { DnbhubTranslateService } from '../../modules/translate/translate.service';
import { DnbhubSendEmailService } from '../../services/send-email/send-email.service';
import { TIMEOUT, WINDOW } from '../../utils';

@Component({
  selector: 'dnbhub-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DnbhubContactDialogComponent {
  /**
   * UI feedback for user actions.
   */
  public feedback?: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IEmailFormValue,
    private readonly dialogRef: MatDialogRef<DnbhubContactDialogComponent>,
    private readonly fb: FormBuilder,
    private readonly translateService: DnbhubTranslateService,
    private readonly sendEmailService: DnbhubSendEmailService,
    @Inject(WINDOW) private readonly window: Window,
  ) {}

  /**
   * Email form.
   */
  public emailForm = this.fb.group({
    email: ['', Validators.compose([Validators.required, Validators.email])],
    name: ['', Validators.compose([Validators.required, Validators.pattern(/\w{2,}/)])],
    header: ['', Validators.compose([Validators.required, Validators.pattern(/\w{4,}/)])],
    message: ['', Validators.compose([Validators.required, Validators.pattern(/[\w\s_-]{50,}/)])],
    domain: [
      this.window.location.origin,
      Validators.compose([Validators.required, Validators.pattern(/.+/)]),
    ],
  }) as IEmailForm;

  /**
   * Submits form.
   */
  public submitForm(): void {
    if (this.emailForm.valid && !this.emailForm.pristine) {
      void this.sendEmail().subscribe();
    }
  }

  /**
   * Sends email.
   */
  public sendEmail() {
    return this.sendEmailService.sendEmail(this.emailForm.value).pipe(
      tap(() => {
        this.feedback = this.translateService.instant('contact.result.success');
        setTimeout(() => {
          this.closeDialog();
        }, TIMEOUT.SHORT);
      }),
    );
  }

  /**
   * Closes dialog.
   * Reports result, arent component should listen to this event.
   * @param [result] result returned to parent component
   */
  public closeDialog(result?: unknown) {
    const res = Boolean(result) ? result : 'closed';
    this.dialogRef.close(res);
  }
}
