import { Component, OnInit, OnDestroy } from '@angular/core';

import { EventEmitterService } from 'src/app/services/event-emitter/event-emitter.service';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { FormBuilder, Validators } from '@angular/forms';

import { IUserProfileForm, ISoundcloudPlaylist } from 'src/app/interfaces/index';
import { SoundcloudService } from 'src/app/services/soundcloud/soundcloud.service';
import { DatabaseReference, DataSnapshot } from '@angular/fire/database/interfaces';

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
   * @param emitter Event emitter service
   * @param firebaseService Firebase service
   * @param soundcloudService Soundcloud service
   * @param fb Form builder
   */
  constructor(
    private emitter: EventEmitterService,
    private firebaseService: FirebaseService,
    private soundcloudService: SoundcloudService,
    private fb: FormBuilder
  ) {}

  /**
   * Component data.
   */
  public details: {
    currentUser: any,
    userDBrecord: any
  } = {
    currentUser: this.firebaseService.fire.auth.currentUser,
    userDBrecord: {}
  };

  /**
   * User profile mode:
   * - edit user
   * - update email
   */
  private mode: {
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
   * User profile form.
   */
  public profileForm: IUserProfileForm;

  /**
   * Resets user profile form.
   * @param [user] user data: email, name
   */
  private resetForm(user?: { email: string, name: string }): void {
    this.profileForm = this.fb.group({
      email: [(user) ? user.email : '', Validators.compose([Validators.required, Validators.email])],
      name: [(user) ? user.name : ''],
      password: ['']
    }) as IUserProfileForm;
  }

  /**
   * Starts password reset procedure.
   */
  public resetPassword(): void {
    console.log('send email with password reset link');
    this.firebaseService.fire.auth.sendPasswordResetEmail(this.details.currentUser.email)
      .then(() => {
        console.log('TODO:snackbar - Password reset email was sent to ' + this.details.currentUser.email);
      })
      .catch((error) => {
        console.log('reset user password, error:', error);
        console.log('TODO:snackbar - There was an error while resetting your password, try again later');
      });
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
   * Gets user details from Sourndcloud.
   */
  private getMe(): void {
    this.soundcloudService.getMe(this.details.userDBrecord.sc_id)
      .then((user: {me: any, playlists: ISoundcloudPlaylist[]}) => {
        console.log('getMe, user', user);
      });
  }

  /**
   * Gets user database record.
   * @param [passGetMeMethodCall] indicates if soundcloud 'get me' api call should be passed
   */
  private getDBuser(passGetMeMethodCall?: boolean): void {
    (this.firebaseService.getDB('users/' + this.details.currentUser.uid, false) as Promise<DataSnapshot>).then((snapshot) => {
      this.details.userDBrecord = snapshot.val();
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
   * Lifecycle hook called on component initialization.
   */
  public ngOnInit(): void {
    console.log('ngOnInit: AppUserComponent initialized');
    this.resetForm();
    this.getDBuser();
  }

  /**
   * Lifecycle hook called on component destruction.
   */
  public ngOnDestroy(): void {
    console.log('ngOnDestroy: AppUserComponent destroyed');
    (this.firebaseService.getDB('users/' + this.details.currentUser.uid, true) as DatabaseReference).off();
  }
}
