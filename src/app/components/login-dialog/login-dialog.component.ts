import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
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
    public readonly dialogRef: MatDialogRef<DnbhubLoginDialogComponent>,
    private readonly fb: FormBuilder,
    private readonly fireSrv: DnbhubFirebaseService,
    private readonly store: Store,
  ) {}

  public readonly loginForm: ILoginForm = this.fb.group({
    email: ['', Validators.compose([Validators.required, Validators.email])],
    password: ['', Validators.compose([Validators.required, Validators.pattern(/\w{8,}/)])],
  }) as ILoginForm;

  private readonly showPasswordSubject = new BehaviorSubject<boolean>(false);

  private readonly signupModeSubject = new BehaviorSubject<boolean>(false);

  private readonly wrongPasswordSubject = new BehaviorSubject<boolean>(false);

  public readonly dataStream$ = combineLatest([
    this.showPasswordSubject,
    this.signupModeSubject,
    this.wrongPasswordSubject,
  ]).pipe(
    map(([showPassword, signupMode, wrongPassword]) => ({
      showPassword,
      signupMode,
      wrongPassword,
    })),
  );

  public togglePasswordVisibility(): void {
    this.showPasswordSubject.next(!this.showPasswordSubject.value);
  }

  private createUser(formData = this.loginForm.value as ILoginFormValue) {
    void this.fireSrv
      .create(formData.email, formData.password)
      .pipe(
        tap(() => {
          this.dialogRef.close();
        }),
      )
      .subscribe();
  }

  private authenticateUser(formData = this.loginForm.value as ILoginFormValue) {
    const email = formData.email;
    const password = formData.password;
    void this.store
      .dispatch(new firebaseActions.emailSignIn({ email, password }))
      .pipe(
        tap(() => {
          void this.store
            .select(DnbhubFirebaseState.getState)
            .pipe(
              filter(state => state.userInfo !== null),
              tap(() => {
                this.dialogRef.close();
                void this.store.dispatch(new Navigate(['/user']));
              }),
            )
            .subscribe();
        }),
      )
      .subscribe();
  }

  /**
   * Sends authentication request with user credentials.
   * Either creates a new user or authenticates an existing user.
   */
  private submitAction() {
    return !this.signupModeSubject.value ? this.authenticateUser() : this.createUser();
  }

  public submitForm(): void {
    if (this.loginForm.valid && !this.loginForm.pristine) {
      this.submitAction();
    }
  }

  public resetPassword() {
    void this.store
      .dispatch(
        new firebaseActions.sendPasswordResetEmail({
          email: this.loginForm.controls.email.value ?? '',
        }),
      )
      .subscribe();
  }
}
