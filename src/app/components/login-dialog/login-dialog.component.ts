import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import firebase from 'firebase';
import { switchMap, tap } from 'rxjs/operators';
import { ILoginForm, ILoginFormValue } from 'src/app/interfaces';
import { firebaseActions } from 'src/app/state/firebase/firebase.actions';
import { DnbhubFirebaseService } from 'src/app/state/firebase/firebase.service';

import { DnbhubFirebaseState } from '../../state/firebase/firebase.store';

@Component({
  selector: 'dnbhub-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DnbhubLoginDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ILoginFormValue,
    private readonly dialogRef: MatDialogRef<DnbhubLoginDialogComponent>,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly fireSrv: DnbhubFirebaseService,
    private readonly store: Store,
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

  /**
   * Toggles password readability via UI,
   */
  public togglePasswordVisibility(): void {
    this.showPassword = this.showPassword ? false : true;
  }

  private createUser(formData = this.loginForm.value as ILoginFormValue) {
    void this.fireSrv
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
    void this.fireSrv
      .authenticate('email', formData.email, formData.password)
      .pipe(
        switchMap(credential => this.store.selectOnce(DnbhubFirebaseState.privilegedAccess)),
        tap(
          privilegedAccess => {
            this.closeDialog({ success: true });
            if (privilegedAccess) {
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
    void this.store
      .dispatch(
        new firebaseActions.sendPasswordResetEmail({
          email: this.loginForm.controls.email.value ?? '',
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
