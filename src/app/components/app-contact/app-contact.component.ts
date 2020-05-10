import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { IEmailForm, IEmailFormValue } from 'src/app/interfaces/forms/email-form.interface';
import { TranslateService } from 'src/app/modules/translate/translate.service';
import { SendEmailService } from 'src/app/services/send-email/send-email.service';
import { ETIMEOUT, WINDOW } from 'src/app/utils';

/**
 * Contact dialog.
 */
@Component({
  selector: 'app-contact',
  templateUrl: './app-contact.component.html',
  styleUrls: ['./app-contact.component.scss'],
  host: {
    class: 'mat-body-1',
  },
})
export class AppContactDialog {
  /**
   * UI feedback for user actions.
   */
  public feedback: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IEmailFormValue,
    private readonly dialogRef: MatDialogRef<AppContactDialog>,
    private readonly fb: FormBuilder,
    private readonly translateService: TranslateService,
    private readonly sendEmailService: SendEmailService,
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
      this.sendEmail().subscribe();
    }
  }

  /**
   * Sends email.
   */
  public sendEmail() {
    return this.sendEmailService.sendEmail(this.emailForm.value).pipe(
      tap(_ => {
        this.feedback = this.translateService.instant('contact.result.success');
        setTimeout(() => {
          this.closeDialog();
        }, ETIMEOUT.SHORT);
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
