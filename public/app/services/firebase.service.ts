import { Injectable } from '@angular/core';

import { CustomDeferredService } from './custom-deferred.service';

import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';

/**
 * Firebase service, uses Angular Fire.
 */
@Injectable()
export class FirebaseService {

  /**
   * @param fireDB Firebase database
   * @param fireAuth Firebase auth
   */
  constructor(
    private fireDB: AngularFireDatabase,
    private fireAuth: AngularFireAuth
  ) {
    console.log('fireDB', this.fireDB);
    console.log('fireAuth', this.fireAuth);
  }

  /**
   * Angular fire public shortcuts.
   */
  public fire: { db: any, auth: any } = {
    db: this.fireDB.database,
    auth: this.fireAuth.auth
  };

  /**
   * Indicates if user is anonymous.
   */
  public anonUser(): boolean {
    // console.log('this.fireAuth.auth.currentUser', this.fireAuth.auth.currentUser);
    return !this.fireAuth.auth.currentUser ? true : false;
  }

  /**
   * Gets firebase database
   * @param collection firebase collection name
   * @param refOnly indicates if db reference only should be returned
   */
  public getDB(collection: 'about'|'blog'|'bandcamp'|string, refOnly: boolean): any {
    return (!refOnly) ? this.fireDB.database.ref('/' + collection).once('value') : this.fireDB.database.ref('/' + collection);
  }

  /**
   * Resolves if user has privileged access.
   */
  public privilegedAccess(): boolean {
    return (!this.fireAuth.user) ? false : (this.fireAuth.user.uid !== 'privileged_access_firebase_uid') ? false : true;
  }

  /**
   * Authenticates user with provided credentials.
   * @param mode login mode
   * @param payload login payload
   */
  public authenticate(mode: 'email'|'twitter', payload: { email: string, password: string }): Promise<any> {
    const def = new CustomDeferredService<any>();
    console.log('mode:', mode);
    console.log('payload:', payload);

    if (mode === 'email') {
      this.fireAuth.auth.signInWithEmailAndPassword(payload.email, payload.password)
        .then((success: any) => {
          // console.log('auth success', success);
          def.resolve(success);
        })
        .catch((error: any) => {
          // console.log('auth error', error);
          def.reject(error);
        });
    }

    if (mode === 'twitter') {
      /*
      *	TODO
      *	https://firebase.google.com/docs/auth/web/twitter-login?authuser=0
      */
      def.reject({ TODO: 'twitter authentication - https://firebase.google.com/docs/auth/web/twitter-login?authuser=0'});
    }
    return def.promise;
  }

  /**
   * Signs user out.
   */
  public signout(): void {
    console.log('signout', this.fireAuth.auth);
    if (this.fireAuth.auth.currentUser) {
      this.fireAuth.auth.signOut();
    }
  }

  /**
   * Creates a user
   * @param payload user credentials
   */
  public create(payload: { email: string, password: string }): Promise<any> {
    const def = new CustomDeferredService<any>();
    this.fireAuth.auth.createUserWithEmailAndPassword(payload.email, payload.password)
      .then((success) => {
        // console.log('auth success', success);
        def.resolve(success);
      })
      .catch((error) => {
        // console.log('auth error', error);
        def.reject(error);
      });
    return def.promise;
  }

  /**
   * Sends password reset link to user's email.
   * @param email user email
   */
  public resetUserPassword(email: string): Promise<any> {
    return this.fireAuth.auth.sendPasswordResetEmail(email);
  }

  /**
   * Deletes a user
   * @param email user email
   * @param password user password
   */
  public delete(email: string, password: string): Promise<any> {
    const def = new CustomDeferredService<any>();
    const credential = this.fireAuth.auth.signInAndRetrieveDataWithEmailAndPassword(email, password);
    this.fireAuth.user.reauthenticateWithCredential(credential)
      .then(() => {
        // console.log('successfully reauthenticated');
        this.getDB('users/' + this.fireAuth.user.uid, true).remove(); // delete user db profile also
        this.fireAuth.user.delete()
          .then(() => {
            def.resolve(true);
          })
          .catch((error) => {
            def.reject(error);
          });
      })
      .catch((error) => {
        def.reject(error);
      });
    return def.promise;
  }

}
