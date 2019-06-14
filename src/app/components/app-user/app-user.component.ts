import { Component, OnInit, OnDestroy } from '@angular/core';

import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { FormBuilder, Validators } from '@angular/forms';

import { IUserProfileForm, ISoundcloudPlaylist, UserProfile } from 'src/app/interfaces/index';
import { SoundcloudService } from 'src/app/services/soundcloud/soundcloud.service';
import { DatabaseReference, DataSnapshot } from '@angular/fire/database/interfaces';
import { AppSpinnerService } from 'src/app/services';
import { Router } from '@angular/router';
import { take, tap } from 'rxjs/operators';
import { SafeResourceUrl } from '@angular/platform-browser';
import { UserDbRecord } from 'src/app/interfaces/user/user-db-record.interface';

/**
 * Application user component.
 */
@Component({
  selector: 'app-user',
  templateUrl: './app-user.component.html',
  host: {
    class: 'mat-body-1'
  }
})
export class AppUserComponent implements OnInit, OnDestroy {

  /**
   * @param spinner Application spinner service
   * @param firebase Firebase service
   * @param soundcloud Soundcloud service
   * @param fb Form builder
   * @param router Application router
   */
  constructor(
    private spinner: AppSpinnerService,
    public firebase: FirebaseService,
    public soundcloud: SoundcloudService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  /**
   * Component data.
   */
  public details: {
    currentUser: any,
    userDBrecord: UserDbRecord,
    submittedPlaylistsIDs: string[],
    existingBlogEntriesIDs: any[],
    preview: {
      submission: ISoundcloudPlaylist
    }
  } = {
    currentUser: this.firebase.fire.auth.currentUser,
    userDBrecord: <UserDbRecord>{},
    submittedPlaylistsIDs: [],
    existingBlogEntriesIDs: [],
    preview: {
      submission: undefined
    }
  };

  /**
   * User profile mode:
   * - edit user
   * - update email
   */
  public mode: {
    edit: boolean,
    updateEmail: boolean
  } = {
    edit: false,
    updateEmail: false
  };

  public toggleEditMode(): void {
    this.mode.edit = (this.mode.edit) ? false : true;
    if (this.mode.edit) {
      const user: {
        email: string,
        name: string
      } = {
        email: this.details.currentUser.email,
        name: this.details.currentUser.displayName
      };
      this.resetForm(user);
    }
  }

  /**
   * Idivates if password should be visible to a user.
   */
  public showPassword = false;

  /**
   * Toggles password visibility.
   */
  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  };

  /**
   * User profile form.
   */
  public profileForm: IUserProfileForm;

  /**
   * Resets user profile form.
   * @param user user data: email, name
   */
  private resetForm(user?: { email: string, name: string }): void {
    this.profileForm = this.fb.group({
      email: [{
        value: (user) ? user.email : '',
        disabled: !this.mode.edit || !this.mode.updateEmail ? true : false
      }, Validators.compose([Validators.required, Validators.email])],
      name: [{
        value: (user) ? user.name : '',
        disabled: !this.mode.edit ? true : false
      }],
      password: ['']
    }) as IUserProfileForm;

    this.formValueChangesSubscription();
  }

  /**
   * Form value changes scubscription.
   * Sets validators dynamically depending on new form value.
   */
  private formValueChangesSubscription(): void {
    this.profileForm.valueChanges.pipe(
      take(1),
      tap((changes: UserProfile) => {
        this.profileForm.patchValue({
          email: {
            value: changes.email,
            disabled: !this.mode.edit || !this.mode.updateEmail
          }
        });
        this.profileForm.controls.email.updateValueAndValidity();
        this.profileForm.patchValue({
          name: {
            value: changes.name,
            disabled: !this.mode.edit
          }
        });
        this.profileForm.controls.email.updateValueAndValidity();
        this.formValueChangesSubscription();
      })
    ).subscribe();
  }

  /**
   * Starts password reset procedure.
   */
  public resetPassword(): void {
    console.log('send email with password reset link');
    this.firebase.fire.auth.sendPasswordResetEmail(this.details.currentUser.email)
      .then(() => {
        console.log('TODO:snackbar - Password reset email was sent to ' + this.details.currentUser.email);
      })
      .catch((error) => {
        console.log('reset user password, error:', error);
        console.log('TODO:snackbar - There was an error while resetting your password, try again later');
      });
  }

  /**
   * Resends verifications email to user.
   */
  public resendVerificationEmail(): void {
    if (!this.details.currentUser.emailVerified) {
      this.firebase.fire.authUser.sendEmailVerification()
        .then(() => {
          console.log('TODO: toaster: check your email for an email with a verification link');
        })
        .catch((error) => {
          console.log('send email verification, error:', error);
          console.log('TODO: toaster: there was an error sending email verification');
        });
    } else {
      console.log('TODO: toaster: Your email is already verified');
    }
  }

  /**
   * Updates user profile.
   */
  public updateProfile(): void {
    console.log('update profile');
    this.details.currentUser.updateProfile({ displayName: this.profileForm.controls.name.value })
      .then(() => {
        console.log('update profile, success');
        this.toggleEditMode();
      })
      .catch((error) => {
        console.log('update profile, error', error);
        console.log('TODO:snackbar - There was an error while updating user profile.');
      });
  }

  /**
   * Deletes user account.
   */
  public deleteProfile(): void {
    if (!this.profileForm.controls.password.value) {
      console.log('delete account, password missing');
      console.log('TODO: toaster: You must provide a password in order to delete your account');
    } else {
      console.log('confirm deletion', confirm);
      this.firebase.delete(this.profileForm.controls.email.value, this.profileForm.controls.password.value).then(
        (success: any) => {
          console.log('account successfully deleted', success);
          this.router.navigate(['']);
        }, (error: any) => {
          console.log('reauthenticate, error', error);
          console.log('There was an error while reauthenticating, it is required for an account deletion.');
        }
      );
    }
  }

  /**
   * Returns soundcloud widget link.
   * @param soundcloudPlaylistID soundcloud playlist id
   */
  public soundcloudWidgetLink(soundcloudPlaylistID: number): SafeResourceUrl {
    const link: SafeResourceUrl = this.soundcloud.widgetLink.playlist(soundcloudPlaylistID);
    return link;
  };

  /**
   * Gets user details from Sourndcloud.
   */
  private getMe(): void {
    this.soundcloud.getMe(this.details.userDBrecord.sc_id.toString())
      .then((user: {me: any, playlists: ISoundcloudPlaylist[]}) => {
        console.log('getMe, user', user);
      });
  }

  /**
   * Connect user account with soundcloud account.
   */
  public scConnect(): void {
    this.soundcloud.SC.connect().then((/*data*/) => {
      // console.log('SC.connect.then, data:', data);
      // console.log('scConnect local storage', localStorage.getItem('callback'));
      const urlParams = localStorage.getItem('callback').replace(/^.*\?/, '').split('&');
      const code = urlParams[0].split('=')[1];
      const oauthToken = urlParams[1].split('#')[1].split('=')[1];
      localStorage.removeItem('callback');
      // console.log('scConnect local storage removed callback', localStorage.getItem('callback'));
      /*
      *	store user auth params for further oauth2/token requests
      */
      this.firebase.setDBuserNewValues({ sc_code: code, sc_oauth_token: oauthToken })
        .then((data) => {
          console.log('setDBuserValues', JSON.stringify(data));
        })
        .catch((error) => {
          console.log('setDBuserValues, error', JSON.stringify(error));
        });
      return this.soundcloud.SC.get('/me');
    }).then((me: any) => {
      console.log('SC.me.then, me', me);
      this.soundcloud.data.user.me = me;
      /*
      *	store user id to be able to retrieve user data without authentication
      */
      this.firebase.setDBuserNewValues({ sc_id: me.id })
        .then((/*data*/) => {
          // console.log('setDBuserValues', JSON.stringify(data));
        })
        .catch((/*error*/) => {
          // console.log('setDBuserValues, error', JSON.stringify(error));
        });
      return this.soundcloud.SC.get('users/' + me.id + '/playlists');
    }).then((playlists: ISoundcloudPlaylist[]) => {
      console.log('SC.playlists.then, playlists', playlists);
      this.soundcloud.data.user.playlists = playlists;
      return playlists;
    });
  }

  /**
   * Gets user database record.
   * @param [passGetMeMethodCall] indicates if soundcloud 'get me' api call should be passed
   */
  private getDBuser(passGetMeMethodCall?: boolean): void {
    (this.firebase.getDB('users/' + this.details.currentUser.uid, false) as Promise<DataSnapshot>).then((snapshot) => {
      this.details.userDBrecord = snapshot.val();
      this.details.submittedPlaylistsIDs = Object.keys(this.details.userDBrecord.submittedPlaylists);
      if (this.details.userDBrecord.sc_id && !passGetMeMethodCall) {
        this.getMe();
      }
      console.log('this.details.userDBrecord', this.details.userDBrecord);
    }).catch((error) => {
      console.log('get user db record, error:', error);
      console.log('TODO:snackbar - There was an error while getting user db record: ' + error);
    });
  }

  /**
   * Gets existing blog entries ids.
   */
  public getExistingBlogEntriesIDs(): void {
    (this.firebase.getDB('blogEntriesIDs') as Promise<DataSnapshot>).then((snapshot) => {
      const response = snapshot.val();
      console.log('getExistingBlogEntriesIDs, response', response);
      this.details.existingBlogEntriesIDs = [...response[0]];
      console.log('$scope.existingBlogEntriesIDs', this.details.existingBlogEntriesIDs);
    }).catch((error) => {
      console.log('error', error);
      console.log('TODO:snackbar - There was an error while getting user db record: ' + error);
    });
  };

  /**
   * Tobbles blog post preview.
   * @param index playlist array index
   */
  public toggleBlogPostPreview(index?: number): void {
    const post: ISoundcloudPlaylist = this.soundcloud.data.user.playlists[index];
    if (post) {
      post.description = this.soundcloud.processDescription(post.description);
    }
    this.details.preview.submission = (this.details.preview.submission) ? undefined : (post) ? post : undefined;
  }

  /**
   * Resolves if a playlist was already added.
   * @param index playlist array index
   */
  public alreadyAdded(index: number): boolean {
    let added = false;
    if (!this.details.existingBlogEntriesIDs) {
      console.log('Unable to add blog posts, there was an error getting existing blog entries');
      added = true;
    } else {
      const post = this.soundcloud.data.user.playlists[index];
      if (post) {
        added = (this.details.existingBlogEntriesIDs.includes(post.id)) ? true : added;
      }
    }
    return added || this.alreadySubmitted(index);
  }

  /**
   * Resolves if a playlist was already submitted.
   * @param index playlist array index
   */
  public alreadySubmitted(index: number): boolean {
    let alreadySubmitted = false;
    const post = this.soundcloud.data.user.playlists[index];
    if (post) {
      if (this.details.userDBrecord.submittedPlaylists) {
        alreadySubmitted = (this.details.userDBrecord.submittedPlaylists.hasOwnProperty(post.id)) ? true : alreadySubmitted;
      }
    }
    return alreadySubmitted;
  }

  /**
   * Resolves if track is unsubmittable.
   * @param index playlist array index
   */
  public unsubmittable(index: number): boolean {
    let unsubmittable = false;
    const post = this.soundcloud.data.user.playlists[index];
    if (post) {
      if (this.details.userDBrecord.submittedPlaylists) {
        unsubmittable = (!this.details.userDBrecord.submittedPlaylists[post.id]) ? true : unsubmittable;
      }
    }
    return unsubmittable;
  }

  /**
   * Unsubmits blog post.
   * @param index playlist array index
   */
  public unsubmitBlogPost(index: number): void {
    if (!this.details.userDBrecord.submittedPlaylists) {
      console.log('No playlists to unsubmit');
    } else {
      console.log(`unsibmit blog post, index ${index}`);
      const post = this.soundcloud.data.user.playlists[index];
      const playlists: any[] = this.details.userDBrecord.submittedPlaylists;
      if (post) {
        if (playlists.hasOwnProperty(post.id) && playlists[post.id] === false) {
          delete playlists[post.id];
          this.firebase.setDBuserNewValues({ submittedPlaylists: playlists })
            .then((data) => {
              console.log('submitBlogPost setDBuserValues', JSON.stringify(data));
              this.getDBuser(true);
            })
            .catch((error) => {
              console.log('submitBlogPost setDBuserValues, error', JSON.stringify(error));
            });
        }
      }
    }
  }

  /**
   * Submits blog post.
   * @param index playlist array index
   */
  public submitBlogPost(index: number): void {
    if (!this.details.existingBlogEntriesIDs) {
      console.log('Unable to add a blog post, there was an error getting existing blog entries');
    } else {
      console.log(`submit blog post, index ${index}`);
      const post = this.soundcloud.data.user.playlists[index];
      const playlists = this.details.userDBrecord.submittedPlaylists || {};
      if (post) {
        /**
         * false - submitted but not approved by a moderator;
         * true - submitted and approved by a moderator;
         */
        playlists[post.id] = false;
        this.firebase.setDBuserNewValues({ submittedPlaylists: playlists })
          .then((data) => {
            console.log('submitBlogPost setDBuserValues', JSON.stringify(data));
            this.getDBuser(true);
          })
          .catch((error) => {
            console.log('submitBlogPost setDBuserValues, error', JSON.stringify(error));
          });
      }
    }
  }

  /**
   * Navigates user to blog post.
   * @param index playlist array index
   */
  public goToBlogEntry(index: number): void {
    console.log('goToBlogEntry, TODO: implement this method');
  }

  /**
   * Lifecycle hook called on component initialization.
   */
  public ngOnInit(): void {
    console.log('ngOnInit: AppUserComponent initialized');
    this.details.currentUser = this.firebase.fire.auth.currentUser;
    console.log('this.details.currentUser', this.details.currentUser);
    const user = {
      email: this.details.currentUser.email,
      name: this.details.currentUser.displayName
    };
    this.resetForm(user);
    this.getDBuser();
    this.getExistingBlogEntriesIDs();
  }

  /**
   * Lifecycle hook called on component destruction.
   */
  public ngOnDestroy(): void {
    console.log('ngOnDestroy: AppUserComponent destroyed');
    (this.firebase.getDB('blogEntriesIDs', true) as DatabaseReference).off();
    (this.firebase.getDB('users/' + this.details.currentUser.uid, true) as DatabaseReference).off();
  }
}
