import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { ILoginForm, ILoginFormValue } from 'src/app/interfaces';
import { DnbhubFirebaseService } from 'src/app/services/firebase/firebase.service';
import { ETIMEOUT } from 'src/app/utils';

/**
 * Application login dialog.
 */
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'dnbhub-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
})
export class DnbhubLoginDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ILoginFormValue,
    private readonly dialogRef: MatDialogRef<DnbhubLoginDialogComponent>,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly firebase: DnbhubFirebaseService,
    private readonly snackBar: MatSnackBar,
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

  private displayFeedback(message: string): void {
    this.snackBar.open(message, null, {
      duration: ETIMEOUT.MEDUIM,
    });
  }

  /**
   * Toggles password readability via UI,
   */
  public togglePasswordVisibility(): void {
    this.showPassword = this.showPassword ? false : true;
  }

  private createUser(formData = this.loginForm.value as ILoginFormValue) {
    void this.firebase
      .create(formData.email, formData.password)
      .pipe(
        tap(() => {
          this.closeDialog({ success: true });
          void this.router.navigate(['/user']);
        }),
      )
      .subscribe();
  }

  private authenticateUser(formData = this.loginForm.value as ILoginFormValue) {
    void this.firebase
      .authenticate('email', formData.email, formData.password)
      .pipe(
        tap(
          () => {
            this.closeDialog({ success: true });
            if (this.firebase.privilegedAccess()) {
              void this.router.navigate(['/admin']);
            } else {
              void this.router.navigate(['/user']);
            }
          },
          (error: firebase.FirebaseError) => {
            if (error.code === 'auth/user-not-found') {
              this.signupMode = true;
              this.wrongPassword = false;
            } else if (error.code === 'auth/wrong-password') {
              this.wrongPassword = true;
            }
          },
        ),
      )
      .subscribe();
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
      this.submitAction();
    }
  }

  /**
   * Resets user password.
   */
  public resetPassword() {
    void this.firebase
      .resetUserPassword(this.loginForm.controls.email.value)
      .pipe(
        tap(() => {
          const message = `Password reset email was sent to ${this.loginForm.controls.email.value}.
              It may take some time for the email to be delivered. Request it again if you do not receive it in about 15 minutes.`;
          this.displayFeedback(message);
        }),
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