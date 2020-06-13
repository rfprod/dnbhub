import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatabaseReference, DataSnapshot } from '@angular/fire/database/interfaces';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { concatMap, mapTo, take, tap } from 'rxjs/operators';
import { IFirebaseUserRecord } from 'src/app/interfaces/firebase';
import { IUserProfile, IUserProfileForm, SoundcloudPlaylist } from 'src/app/interfaces/index';
import { DnbhubFirebaseService } from 'src/app/services/firebase/firebase.service';
import { DnbhubSoundcloudService } from 'src/app/state/soundcloud/soundcloud.service';
import { ETIMEOUT } from 'src/app/utils';

import { IFirebaseUserSubmittedPlaylists } from '../../interfaces/firebase/firebase-user.interface';

/**
 * Application user component.
 */
@Component({
  selector: 'dnbhub-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class DnbhubUserComponent implements OnInit, OnDestroy {
  public readonly anonUser$ = this.firebase.anonUser$;

  public readonly me$ = this.soundcloud.me$;

  public readonly myPlaylists$ = this.soundcloud.myPlaylists$;

  public readonly firebaseUser = this.firebase.fire.user;

  private userDbRecord: IFirebaseUserRecord = {} as IFirebaseUserRecord;

  private existingBlogEntriesIDs: number[] = [];

  public submissionPreview: SoundcloudPlaylist = null;

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
  public profileForm: IUserProfileForm;

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
    this.snackBar.open(message, null, {
      duration: ETIMEOUT.SHORT,
    });
  }

  public toggleEditMode(): void {
    this.mode.edit = this.mode.edit ? false : true;
    if (this.mode.edit) {
      const user: {
        email: string;
        name: string;
      } = {
        email: this.firebaseUser.email,
        name: this.firebaseUser.displayName,
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
          value: user ? user.email : '',
          disabled: !this.mode.edit || !this.mode.updateEmail ? true : false,
        },
        Validators.compose([Validators.required, Validators.email]),
      ],
      name: [
        {
          value: user ? user.name : '',
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
    this.profileForm.valueChanges
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
      .sendPasswordResetEmail(this.firebaseUser.email)
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
    if (!this.firebaseUser.emailVerified) {
      this.firebase.fire.user
        .sendEmailVerification()
        .then(() => {
          const message = 'Check your email for an email with a verification link.';
          this.displayMessage(message);
        })
        .catch(error => {
          this.displayMessage(error);
        });
    } else {
      const error = 'Your email is already verified';
      this.displayMessage(error);
    }
  }

  /**
   * Updates user profile.
   */
  public updateProfile(): void {
    this.firebaseUser
      .updateProfile({ displayName: this.profileForm.controls.name.value })
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
      this.firebase
        .delete(this.profileForm.controls.email.value, this.profileForm.controls.password.value)
        .pipe(
          tap(success => {
            const message = `Your profile was deleted. ${success}`;
            this.displayMessage(message);
            void this.router.navigate(['']);
          }),
        );
    }
  }

  /**
   * Gets user details from Sourndcloud.
   */
  private getUserData(userScId?: number) {
    return this.soundcloud
      .getMe(userScId)
      .pipe(concatMap(me => this.soundcloud.getMyPlaylists(me.id).pipe(mapTo(me))));
  }

  /**
   * Connect user account with soundcloud account.
   */
  public scConnect(): void {
    void this.soundcloud.connect().then(connectResult => {
      console.warn('SC.connect.then, data:', connectResult);

      const urlParams = localStorage.getItem('callback').replace(/^.*\?/, '').split('&');
      const code = urlParams[0].split('=')[1];
      const oauthToken = urlParams[1].split('#')[1].split('=')[1];
      localStorage.removeItem('callback');

      this.firebase
        .setDBuserNewValues({ soundcloudCode: code, soundcloudOauthToken: oauthToken })
        .pipe(
          concatMap(() => this.getUserData()),
          concatMap(me =>
            this.firebase.setDBuserNewValues({ soundcloudId: me.id }).pipe(
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
   * Gets user database record.
   * @param [passGetMeMethodCall] indicates if soundcloud 'get me' api call should be passed
   */
  private getDBuser(passGetMeMethodCall?: boolean): void {
    (this.firebase.getDB('users/' + this.firebaseUser.uid, false) as Promise<DataSnapshot>)
      .then(snapshot => {
        this.userDbRecord = snapshot.val();
        if (Boolean(this.userDbRecord.soundcloudId) && !passGetMeMethodCall) {
          this.getUserData(this.userDbRecord.soundcloudId).subscribe();
        }
      })
      .catch(error => {
        this.displayMessage(error);
      });
  }

  /**
   * Gets existing blog entries ids.
   */
  public getExistingBlogEntriesIDs(): void {
    (this.firebase.getDB('blogEntriesIDs') as Promise<DataSnapshot>)
      .then(snapshot => {
        const response: [number[]] = snapshot.val();
        this.existingBlogEntriesIDs = [...response[0]];
      })
      .catch(error => {
        this.displayMessage(error);
      });
  }

  /**
   * Tobbles blog post preview.
   */
  public toggleBlogPostPreview(playlist?: SoundcloudPlaylist): void {
    this.submissionPreview = this.submissionPreview ? null : playlist ? playlist : null;
  }

  /**
   * Resolves if a playlist is already added.
   */
  public alreadyAdded(playlist: SoundcloudPlaylist): boolean {
    let added = false;
    if (!this.existingBlogEntriesIDs) {
      const error = 'Unable to add blog posts, there was an error getting existing blog entries';
      this.displayMessage(error);
      added = true;
    } else {
      added = this.existingBlogEntriesIDs.includes(playlist.id) ? true : added;
    }
    return added || this.alreadySubmitted(playlist);
  }

  /**
   * Resolves if a playlist is already submitted.
   */
  public alreadySubmitted(playlist: SoundcloudPlaylist): boolean {
    let alreadySubmitted = false;
    if (Boolean(this.userDbRecord.submittedPlaylists)) {
      alreadySubmitted = this.userDbRecord.submittedPlaylists.hasOwnProperty(playlist.id)
        ? true
        : alreadySubmitted;
    }

    return alreadySubmitted;
  }

  /**
   * Resolves if track is unsubmittable.
   * @param index playlist array index
   */
  public unsubmittable(playlist: SoundcloudPlaylist): boolean {
    let unsubmittable = false;
    if (Boolean(this.userDbRecord.submittedPlaylists)) {
      unsubmittable = !Boolean(this.userDbRecord.submittedPlaylists[playlist.id])
        ? true
        : unsubmittable;
    }
    return unsubmittable;
  }

  /**
   * Unsubmits blog post.
   * @param index playlist array index
   */
  public unsubmitBlogPost(playlist: SoundcloudPlaylist): void {
    if (!this.userDbRecord.submittedPlaylists) {
      const error = 'No playlists to unsubmit';
      this.displayMessage(error);
    } else {
      const playlists = this.userDbRecord.submittedPlaylists;
      const unsubmitPlaylistId = playlist.id.toString();

      if (playlists.hasOwnProperty(unsubmitPlaylistId) && playlists[unsubmitPlaylistId] === false) {
        const playListKeys = Object.keys(playlists);
        const submittedPlaylists: IFirebaseUserSubmittedPlaylists = {};
        for (const key of playListKeys) {
          if (key !== unsubmitPlaylistId) {
            submittedPlaylists[key] = playlists[key];
          }
        }
        this.firebase
          .setDBuserNewValues({ submittedPlaylists })
          .pipe(
            tap(data => {
              const message = `Your user profile was updated. ${data}`;
              this.displayMessage(message);
              this.getDBuser(true);
            }),
          )
          .subscribe();
      }
    }
  }

  /**
   * Submits blog post.
   * @param index playlist array index
   */
  public submitBlogPost(playlist: SoundcloudPlaylist): void {
    if (!this.existingBlogEntriesIDs) {
      const error = 'Unable to add a blog post, there was an error getting existing blog entries';
      this.displayMessage(error);
    } else {
      const playlists = this.userDbRecord.submittedPlaylists || {};

      /**
       * false - submitted but not approved by a moderator;
       * true - submitted and approved by a moderator;
       */
      playlists[playlist.id] = false;
      this.firebase
        .setDBuserNewValues({ submittedPlaylists: playlists })
        .pipe(
          tap(data => {
            const message = `Your user profile was updated. ${data}`;
            this.displayMessage(message);
            this.getDBuser(true);
          }),
        )
        .subscribe();
    }
  }

  public ngOnInit(): void {
    const user = {
      email: this.firebase.fire.user.email,
      name: this.firebase.fire.user.displayName,
    };
    this.resetForm(user);
    this.getDBuser();
    this.getExistingBlogEntriesIDs();
  }

  public ngOnDestroy(): void {
    (this.firebase.getDB('blogEntriesIDs', true) as DatabaseReference).off();
    (this.firebase.getDB('users/' + this.firebaseUser.uid, true) as DatabaseReference).off();
  }
}
