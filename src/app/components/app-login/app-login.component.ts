import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { ILoginForm, ILoginFormValue } from 'src/app/interfaces';
import { HttpHandlersService } from 'src/app/services';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';

/**
 * Application login dialog.
 */
@Component({
  selector: 'app-login',
  templateUrl: './app-login.component.html',
  styleUrls: ['./app-login.component.scss'],
  host: {
    class: 'mat-body-1',
  },
})
export class AppLoginDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ILoginFormValue,
    private readonly dialogRef: MatDialogRef<AppLoginDialog>,
    private readonly fb: FormBuilder,
    private readonly handlers: HttpHandlersService,
    private readonly router: Router,
    private readonly firebase: FirebaseService,
  ) {}

  /**
   * Login form.
   */
  public readonly loginForm: ILoginForm = this.fb.group({
    email: ['', Validators.compose([Validators.required, Validators.email])],
    password: ['', Validators.compose([Validators.required, Validators.pattern(/\w{8,}/)])],
  }) as ILoginForm;

  public showPassword = false;

  public signupMode = false;

  public wrongPassword = false;

  public feedback: string;

  /**
   * Toggles password readability via UI,
   */
  public togglePasswordVisibility(): void {
    this.showPassword = this.showPassword ? false : true;
  }

  private createUser(formData = this.loginForm.value as ILoginFormValue) {
    const promise = this.firebase
      .create({ email: formData.email, password: formData.password })
      .then(
        user => {
          this.closeDialog({ success: true });
          void this.router.navigate(['/user']);
        },
        (error: { code: string }) => {
          this.feedback = `An error occurred: ${error.code}`;
        },
      );
    return from(promise);
  }

  private authenticateUser(formData = this.loginForm.value as ILoginFormValue) {
    const promise = this.firebase
      .authenticate('email', { email: formData.email, password: formData.password })
      .then(
        user => {
          this.closeDialog({ success: true });
          if (this.firebase.privilegedAccess()) {
            void this.router.navigate(['/admin']);
          } else {
            void this.router.navigate(['/user']);
          }
        },
        (error: { code: string }) => {
          if (error.code === 'auth/user-not-found') {
            this.feedback =
              'We did not find an account registered with this email address. To create a new account hit a CREATE ACCOUNT button.';
            this.signupMode = true;
            this.wrongPassword = false;
          } else if (error.code === 'auth/wrong-password') {
            this.feedback = 'Password does not match an email address.';
            this.wrongPassword = true;
          } else {
            this.feedback = 'Unknown error occurred. Try again later.';
          }
        },
      );
    return from(promise);
  }

  /**
   * Sends authentication request with user credentials.
   */
  public submitAction() {
    return !this.signupMode ? this.authenticateUser() : this.createUser();
  }

  /**
   * Submits form.
   */
  public submitForm(): void {
    if (this.loginForm.valid && !this.loginForm.pristine) {
      this.submitAction().subscribe();
    }
  }

  /**
   * Resets user password.
   */
  public resetPassword(): void {
    this.handlers
      .pipeHttpRequest(
        from(
          this.firebase
            .resetUserPassword(this.loginForm.controls.email.value)
            .then(() => {
              this.feedback = `Password reset email was sent to ${this.loginForm.controls.email.value}. It may take some time for the email to be delivered. Request it again if you do not receive it in about 15 minutes.`;
            })
            .catch(error => error),
        ),
      )
      .subscribe();
  }

  /**
   * Closes dialog.
   * @param [result] result returned to parent component
   */
  public closeDialog(result?: unknown) {
    const res = Boolean(result) ? result : 'closed';
    this.dialogRef.close(res);
  }
}
