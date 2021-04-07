import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { BehaviorSubject } from 'rxjs';
import { concatMap, mapTo, take, tap } from 'rxjs/operators';
import { setDBuserNewValuesOptions } from 'src/app/interfaces/firebase';
import { ISoundcloudMe, IUserProfile, IUserProfileForm } from 'src/app/interfaces/index';
import { DnbhubFirebaseService } from 'src/app/state/firebase/firebase.service';
import { DnbhubSoundcloudService } from 'src/app/state/soundcloud/soundcloud.service';
import { TIMEOUT } from 'src/app/utils';

import { userActions } from '../../state/user/user.store';

interface IComponentChanges extends SimpleChanges {
  me: SimpleChange;
  firebaseUser: SimpleChange;
}

@Component({
  selector: 'dnbhub-user-me',
  templateUrl: './user-me.component.html',
  styleUrls: ['./user-me.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DnbhubUserMeComponent implements OnChanges {
  @Input() public me: ISoundcloudMe | null = null;

  @Input() public firebaseUser: firebase.default.User | null = null;

  private readonly editMode = new BehaviorSubject<boolean>(false);

  public readonly editMode$ = this.editMode.asObservable();

  private readonly showPassword = new BehaviorSubject<boolean>(false);

  public readonly showPassword$ = this.showPassword.asObservable();

  /**
   * User profile form.
   */
  public profileForm: IUserProfileForm = this.fb.group({
    email: [
      { value: '', disabled: true },
      Validators.compose([Validators.required, Validators.email]),
    ],
    name: [{ value: '', disabled: true }],
    password: [''],
  }) as IUserProfileForm;

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly firebase: DnbhubFirebaseService,
    private readonly soundcloud: DnbhubSoundcloudService,
    private readonly snackBar: MatSnackBar,
  ) {}

  public ngOnChanges(changes: IComponentChanges) {
    if (typeof changes.firebaseUser !== 'undefined') {
      this.resetForm({
        name: this.firebaseUser?.displayName ?? '',
        email: this.firebaseUser?.email ?? '',
      });
    }
  }

  /**
   * Toggles password visibility.
   */
  public togglePasswordVisibility(): void {
    this.showPassword.next(!this.showPassword.value);
  }

  public displayMessage(message: string): void {
    this.snackBar.open(message, void 0, {
      duration: TIMEOUT.SHORT,
    });
  }

  public toggleEditMode(): void {
    this.editMode.next(!this.editMode.value);
    const user: {
      email: string;
      name: string;
    } = {
      email: this.firebaseUser?.email ?? '',
      name: this.firebaseUser?.displayName ?? '',
    };
    this.resetForm(user);
  }

  /**
   * Resets user profile form.
   * @param user user data: email, name
   */
  private resetForm(user?: { email: string; name: string }): void {
    this.profileForm = this.fb.group({
      email: [
        {
          value: user?.email ?? '',
          disabled: true,
        },
        Validators.compose([Validators.required, Validators.email]),
      ],
      name: [
        {
          value: user?.name ?? '',
          disabled: !this.editMode.value,
        },
      ],
      password: [''],
    }) as IUserProfileForm;

    this.formValueChangesSubscription();
  }

  /**
   * Form value changes scubscription.
   * Sets validators dynamically depending on new form value.
   */
  private formValueChangesSubscription(): void {
    void this.profileForm.valueChanges
      .pipe(
        take(1),
        tap((changes: IUserProfile) => {
          this.profileForm.patchValue({
            email: Boolean(changes.email) ? changes.email : this.profileForm.controls.email.value,
            name: changes.name,
          });
          this.profileForm.controls.email.disable();
          this.profileForm.controls.email.updateValueAndValidity();
          if (!this.editMode.value) {
            this.profileForm.controls.name.disable();
          }
          this.profileForm.controls.name.updateValueAndValidity();
          this.formValueChangesSubscription();
        }),
      )
      .subscribe();
  }

  /**
   * Starts password reset procedure.
   */
  public resetPassword(): void {
    this.firebase.fireAuth
      .sendPasswordResetEmail(this.firebaseUser?.email ?? '')
      .then(() => {
        const message = 'Password reset link was sent to you over email.';
        this.displayMessage(message);
      })
      .catch(error => {
        this.displayMessage(error);
      });
  }

  /**
   * Updates user profile.
   */
  public updateProfile(): void {
    void this.store.dispatch(
      new userActions.updateFirebaseProfile({ displayName: this.profileForm.controls.name.value }),
    );
  }

  /**
   * Deletes user account.
   */
  public deleteProfile(): void {
    if (!Boolean(this.profileForm.controls.password.value)) {
      const error = 'You must provide a password in order to delete your account';
      this.displayMessage(error);
    } else {
      void this.firebase
        .delete(this.profileForm.controls.email.value, this.profileForm.controls.password.value)
        .pipe(
          tap(success => {
            const message = `Your profile was deleted. ${success}`;
            this.displayMessage(message);
            void this.router.navigate(['']);
          }),
        )
        .subscribe();
    }
  }

  /**
   * Gets user details from Sourndcloud.
   */
  private getUserData(userScId?: number) {
    return this.soundcloud
      .getMe(userScId)
      .pipe(concatMap(me => this.soundcloud.getMyPlaylists(me.id ?? 0).pipe(mapTo(me))));
  }

  /**
   * Connect user account with soundcloud account.
   */
  public scConnect(): void {
    void this.soundcloud.connect().then(connectResult => {
      console.warn('SC.connect.then, data:', connectResult);

      const urlParams = localStorage.getItem('callback')?.replace(/^.*\?/, '').split('&') ?? [];
      const code = urlParams[0].split('=')[1];
      const oauthToken = urlParams[1].split('#')[1].split('=')[1];
      localStorage.removeItem('callback');

      void this.getUserData()
        .pipe(
          concatMap(me =>
            this.firebase
              .setDBuserNewValues(setDBuserNewValuesOptions(me.id, code, oauthToken))
              .pipe(
                tap(data => {
                  const message = `${data}: Your user profile was updated.`;
                  this.displayMessage(message);
                }),
              ),
          ),
        )
        .subscribe();

      return connectResult;
    });
  }
}
