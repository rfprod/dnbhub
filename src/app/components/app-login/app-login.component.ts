import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ILoginForm } from 'src/app/interfaces';
import { AppSpinnerService } from 'src/app/services';
import { CustomDeferredService } from 'src/app/services/custom-deferred/custom-deferred.service';
import { EventEmitterService } from 'src/app/services/event-emitter/event-emitter.service';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';

/**
 * Application login dialog.
 */
@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './app-login.component.html',
  host: {
    class: 'mat-body-1',
  },
})
export class AppLoginDialog implements OnInit, OnDestroy {
  /**
   * @param data Dialog data provided by parent controller
   * @param dialogRef Dialog reference
   * @param fb Form builder - user input procession
   * @param emitter Event emitter service
   * @param spinner Application spinner service
   * @param router Allication router
   * @param firebaseService Firebase service
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly dialogRef: MatDialogRef<AppLoginDialog>,
    private readonly fb: FormBuilder,
    private readonly emitter: EventEmitterService,
    private readonly spinner: AppSpinnerService,
    private readonly router: Router,
    private readonly firebaseService: FirebaseService,
  ) {}

  /**
   * Login form.
   */
  public loginForm: ILoginForm;

  /**
   * Resets login form group.
   */
  private resetForm(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.pattern(/\w{8,}/)])],
    }) as ILoginForm;
  }

  /**
   * Indicates if password should be readable in UI,
   */
  public showPassword = false;

  /**
   * Toggles password readability via UI,
   */
  public togglePasswordVisibility(): void {
    this.showPassword = this.showPassword ? false : true;
  }

  /**
   * Indicates if signup mode should be used then signing user in.
   */
  public signupMode = false;

  /**
   * Indicates if user provided a wrong password.
   */
  public wrongPassword = false;

  /**
   * Submits form.
   */
  public submitForm(): void {
    if (this.loginForm.valid && !this.loginForm.pristine) {
      this.login().catch((error: any) => {
        console.log('login, error', error);
      });
    }
  }

  /**
   * Sends authentication request with user credentials.
   */
  public login(): Promise<boolean> {
    const def = new CustomDeferredService<boolean>();
    this.spinner.startSpinner();
    const formData: any = this.loginForm.value;
    if (!this.signupMode) {
      this.firebaseService
        .authenticate('email', { email: formData.email, password: formData.password })
        .then(
          (user: any) => {
            console.log('auth success, user', user);
            this.closeDialog({ success: true });
            if (this.firebaseService.privilegedAccess()) {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/user']);
            }
            this.spinner.stopSpinner();
            def.resolve();
          },
          (error: any) => {
            // console.log('auth error', error);
            console.log('auth error');
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
            setTimeout(() => {
              this.loading = false;
              this.spinner.stopSpinner();
              def.reject();
            }, 1000);
          },
        );
    } else {
      this.firebaseService.create({ email: formData.email, password: formData.password }).then(
        (user: any) => {
          console.log('signup success', user);
          this.closeDialog({ success: true });
          this.router.navigate(['/user']);
          this.spinner.stopSpinner();
          def.resolve();
        },
        (error: any) => {
          console.log('signup error', error);
          this.feedback = 'An error occurred: ' + error.code;
          setTimeout(() => {
            this.loading = false;
            this.spinner.stopSpinner();
            def.reject();
          }, 1000);
        },
      );
    }
    return def.promise;
  }

  /**
   * Resets user password.
   */
  public resetPassword(): void {
    console.log('send email with password reset link');
    this.loading = true;
    this.firebaseService
      .resetUserPassword(this.loginForm.controls.email.value)
      .then(() => {
        this.feedback =
          'Password reset email was sent to ' +
          this.loginForm.controls.email.value +
          '. It may take some time for the email to be delivered. Request it again if you do not receive it in about 15 minutes.';
        // console.log('this.instructions:', this.instructions);
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      })
      .catch(error => {
        console.log('reset user password, error:', error);
        this.feedback = error.message;
        // console.log('this.instructions:', this.instructions);
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      });
  }

  /**
   * Closes dialog.
   * @param [result] result returned to parent component
   */
  private closeDialog(result?: any) {
    /*
     *	report result if it was commonly closed, or modified and closed, deleted,
     *	or optional use result is provided
     *	parent controller should listen to this event
     */
    result = result ? result : 'closed';
    this.dialogRef.close(result);
  }

  /**
   * UI feedback for user actions.
   */
  public feedback: string;

  /**
   * Dialog loading state.
   */
  private loading = false;
  /**
   * Use in templates to get loaded state.
   */
  public loaded(): boolean {
    return !this.loading;
  }

  /**
   * Starts progress.
   */
  private startProgress(): void {
    this.loading = true;
  }
  /**
   * Stops progress.
   */
  private stopProgress(): void {
    this.loading = false;
  }

  /**
   * Lifecycle hook called after component is initialized.
   */
  public ngOnInit(): void {
    console.log('ngOnInit: AppLoginDialog initialized');
    this.resetForm();

    this.emitter
      .getEmitter()
      .pipe(untilDestroyed(this))
      .subscribe((event: any) => {
        console.log('AppLoginDialog consuming event:', event);
        if (event.progress) {
          if (event.progress === 'start') {
            console.log('AppLoginDialog, starting progress');
            this.startProgress();
          } else if (event.progress === 'stop') {
            console.log('AppLoginDialog, stopping progress');
            this.stopProgress();
          }
        }
      });
  }

  /**
   * Lifecycle hook called after component is destroyed.
   */
  public ngOnDestroy(): void {
    console.log('ngOnDestroy: AppLoginDialog destroyed');
  }
}
