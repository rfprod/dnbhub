import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { concatMap, first, map, mapTo, switchMap, take, tap } from 'rxjs/operators';
import { IFirebaseUserRecord } from 'src/app/interfaces/firebase';
import { IUserProfile, IUserProfileForm, SoundcloudPlaylist } from 'src/app/interfaces/index';
import { DnbhubFirebaseService } from 'src/app/services/firebase/firebase.service';
import { DnbhubSoundcloudService } from 'src/app/state/soundcloud/soundcloud.service';
import { TIMEOUT } from 'src/app/utils';

import { IFirebaseUserSubmittedPlaylists } from '../../interfaces/firebase/firebase-user.interface';

@Component({
  selector: 'dnbhub-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DnbhubUserComponent implements OnInit {
  public readonly anonUser$ = this.firebase.anonUser$;

  public readonly me$ = this.soundcloud.me$;

  public readonly myPlaylists$ = this.soundcloud.myPlaylists$;

  public readonly firebaseUser = this.firebase.fire.user;

  public readonly userDbRecord$ = this.firebase
    .getListItem<IFirebaseUserRecord>(`users/${this.firebaseUser?.uid ?? ''}`)
    .valueChanges()
    .pipe(
      concatMap(userRecord => {
        if (userRecord !== null) {
          return this.getUserData(userRecord.sc_id).pipe(mapTo(userRecord));
        }
        return of(userRecord);
      }),
    );

  private readonly existingBlogEntriesIDs: number[] = [];

  public submissionPreview: SoundcloudPlaylist | null = null;

  /**
   * User profile mode:
   * - edit user
   * - update email
   */
  public mode: {
    edit: boolean;
    updateEmail: boolean;
  } = {
    edit: false,
    updateEmail: false,
  };

  /**
   * User profile form.
   */
  public profileForm: IUserProfileForm = this.fb.group({
    email: [
      {
        value: '',
        disabled: !this.mode.edit || !this.mode.updateEmail ? true : false,
      },
      Validators.compose([Validators.required, Validators.email]),
    ],
    name: [
      {
        value: '',
        disabled: !this.mode.edit ? true : false,
      },
    ],
    password: [''],
  }) as IUserProfileForm;

  /**
   * Idivates if password should be visible to a user.
   */
  public showPassword = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly firebase: DnbhubFirebaseService,
    private readonly soundcloud: DnbhubSoundcloudService,
    private readonly snackBar: MatSnackBar,
  ) {}

  /**
   * Toggles password visibility.
   */
  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  public displayMessage(message: string): void {
    this.snackBar.open(message, void 0, {
      duration: TIMEOUT.SHORT,
    });
  }

  public toggleEditMode(): void {
    this.mode.edit = this.mode.edit ? false : true;
    if (this.mode.edit) {
      const user: {
        email: string;
        name: string;
      } = {
        email: this.firebaseUser?.email ?? '',
        name: this.firebaseUser?.displayName ?? '',
      };
      this.resetForm(user);
    }
  }

  /**
   * Resets user profile form.
   * @param user user data: email, name
   */
  private resetForm(user?: { email: string; name: string }): void {
    this.profileForm = this.fb.group({
      email: [
        {
          value: typeof user !== 'undefined' ? user.email : '',
          disabled: !this.mode.edit || !this.mode.updateEmail ? true : false,
        },
        Validators.compose([Validators.required, Validators.email]),
      ],
      name: [
        {
          value: typeof user !== 'undefined' ? user.name : '',
          disabled: !this.mode.edit ? true : false,
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
            email: {
              value: changes.email,
              disabled: !this.mode.edit || !this.mode.updateEmail,
            },
          });
          this.profileForm.controls.email.updateValueAndValidity();
          this.profileForm.patchValue({
            name: {
              value: changes.name,
              disabled: !this.mode.edit,
            },
          });
          this.profileForm.controls.email.updateValueAndValidity();
          this.formValueChangesSubscription();
        }),
      )
      .subscribe();
  }

  /**
   * Starts password reset procedure.
   */
  public resetPassword(): void {
    this.firebase.fire.auth
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
   * Resends verifications email to user.
   */
  public resendVerificationEmail(): void {
    if (!Boolean(this.firebaseUser?.emailVerified)) {
      this.firebase.fire?.user
        ?.sendEmailVerification()
        .then(() => {
          const message = 'Check your email for an email with a verification link.';
          this.displayMessage(message);
        })
        .catch(error => {
          this.displayMessage(error);
        });
    } else {
      const message = 'Your email is already verified.';
      this.displayMessage(message);
    }
  }

  /**
   * Updates user profile.
   */
  public updateProfile(): void {
    this.firebaseUser
      ?.updateProfile({ displayName: this.profileForm.controls.name.value })
      .then(() => {
        const message = 'Your profile was updated.';
        this.displayMessage(message);
        this.toggleEditMode();
      })
      .catch(error => {
        this.displayMessage(error);
      });
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

      void this.firebase
        // eslint-disable-next-line @typescript-eslint/naming-convention
        .setDBuserNewValues({ sc_code: code, sc_oauth_token: oauthToken })
        .pipe(
          concatMap(() => this.getUserData()),
          concatMap(me =>
            // eslint-disable-next-line @typescript-eslint/naming-convention
            this.firebase.setDBuserNewValues({ sc_id: me.id }).pipe(
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

  /**
   * Tobbles blog post preview.
   */
  public toggleBlogPostPreview(playlist?: SoundcloudPlaylist): void {
    this.submissionPreview = Boolean(this.submissionPreview)
      ? null
      : typeof playlist !== 'undefined'
      ? playlist
      : null;
  }

  /**
   * Resolves if a playlist is already added.
   */
  public readonly alreadyAdded$ = (playlist: SoundcloudPlaylist) => {
    let added = false;
    if (!Boolean(this.existingBlogEntriesIDs)) {
      const message = 'Unable to add blog posts, there was an error getting existing blog entries';
      this.displayMessage(message);
      added = true;
    } else {
      added = this.existingBlogEntriesIDs.includes(playlist.id) ? true : added;
    }
    return added ? of(added) : this.alreadySubmitted$(playlist);
  };

  /**
   * Resolves if a playlist is already submitted.
   */
  public readonly alreadySubmitted$ = (playlist: SoundcloudPlaylist) =>
    this.firebase
      .getListItem<IFirebaseUserRecord>(`users/${this.firebaseUser?.uid ?? ''}`)
      .valueChanges()
      .pipe(
        map(userRecord => {
          if (userRecord !== null) {
            if (Boolean(userRecord.submittedPlaylists)) {
              return userRecord.submittedPlaylists[playlist.id] ? true : false;
            }
          }
          return false;
        }),
      );

  /**
   * Resolves if track is unsubmittable.
   * @param index playlist array index
   */
  public readonly unsubmittable$ = (playlist: SoundcloudPlaylist) =>
    this.firebase
      .getListItem<IFirebaseUserRecord>(`users/${this.firebaseUser?.uid ?? ''}`)
      .valueChanges()
      .pipe(
        map(userRecord => {
          if (userRecord !== null) {
            if (Boolean(userRecord.submittedPlaylists)) {
              return !Boolean(userRecord.submittedPlaylists[playlist.id]) ? true : false;
            }
          }
          return false;
        }),
      );

  /**
   * Unsubmits blog post.
   * @param index playlist array index
   */
  public unsubmitBlogPost(playlist: SoundcloudPlaylist): void {
    void this.firebase
      .getListItem<IFirebaseUserRecord>(`users/${this.firebaseUser?.uid ?? ''}`)
      .valueChanges()
      .pipe(
        first(),
        switchMap(userRecord => {
          if (userRecord !== null) {
            const playlists = userRecord.submittedPlaylists;
            const unsubmitPlaylistId = playlist.id.toString();

            if (!Boolean(playlists)) {
              const message = 'No playlists to unsubmit.';
              this.displayMessage(message);
              return throwError(new Error(message));
            } else if (playlists[unsubmitPlaylistId] === false) {
              const userDbRecord = userRecord;
              const playListKeys = Object.keys(playlists);
              const submittedPlaylists: IFirebaseUserSubmittedPlaylists = {};

              for (const key of playListKeys) {
                if (key !== unsubmitPlaylistId) {
                  submittedPlaylists[key] = playlists[key];
                }
              }
              userDbRecord.submittedPlaylists = { ...submittedPlaylists };

              return this.firebase.setDBuserNewValues({ submittedPlaylists }).pipe(
                tap(() => {
                  const message = `Playlist ${playlist.title} was successfully unsubmitted.`;
                  this.displayMessage(message);
                }),
              );
            }

            return throwError(new Error('Playlist is no unsubmittable.'));
          }
          return throwError(new Error('User does not exist.'));
        }),
      )
      .subscribe();
  }

  /**
   * Submits blog post.
   * @param index playlist array index
   */
  public submitBlogPost(playlist: SoundcloudPlaylist): void {
    if (!Boolean(this.existingBlogEntriesIDs)) {
      const message = 'Unable to add a blog post, there was an error getting existing blog entries';
      this.displayMessage(message);
    } else {
      void this.firebase
        .getListItem<IFirebaseUserRecord>(`users/${this.firebaseUser?.uid ?? ''}`)
        .valueChanges()
        .pipe(
          first(),
          switchMap(userDbRecord => {
            if (userDbRecord !== null) {
              /**
               * false - submitted but not approved by a moderator;
               * true - submitted and approved by a moderator;
               */
              userDbRecord.submittedPlaylists[playlist.id] = false;
              return this.firebase
                .setDBuserNewValues({ submittedPlaylists: userDbRecord.submittedPlaylists })
                .pipe(
                  tap(() => {
                    const message = `Playlist ${playlist.title} was successfully submitted.`;
                    this.displayMessage(message);
                  }),
                );
            }
            return of(null);
          }),
        )
        .subscribe();
    }
  }

  public ngOnInit(): void {
    const user = {
      email: this.firebase.fire?.user?.email ?? '',
      name: this.firebase.fire?.user?.displayName ?? '',
    };
    this.resetForm(user);
  }
}
