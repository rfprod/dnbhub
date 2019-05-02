import { Injectable } from '@angular/core';

import { CustomDeferredService } from 'src/app/services/custom-deferred/custom-deferred.service';

import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  DataSnapshot,
  DatabaseReference,
  DatabaseSnapshotExists
} from '@angular/fire/database/interfaces';
import {
  FirebaseDatabase,
  FirebaseAuth
} from '@angular/fire/firebase-node';

import { AppEnvironmentConfig } from 'src/app/app.environment';
import { IFirebaseENVInterface } from 'src/app/interfaces';
import { IBlogPost } from 'src/app/interfaces/blog/blog-post.interface';

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
    this.fireAuthUserSubscription();
  }

  /**
   * Application environment: Firebase API.
   */
  private config: IFirebaseENVInterface = new AppEnvironmentConfig().firebase;

  /**
   * Angular fire public shortcuts.
   */
  public fire: { db: FirebaseDatabase, auth: FirebaseAuth, authUser: any } = {
    db: this.fireDB.database,
    auth: this.fireAuth.auth,
    authUser: null
  };

  /**
   * Indicates if user is anonymous.
   */
  public anonUser(): boolean {
    // console.log('this.fireAuth.auth.currentUser', this.fireAuth.auth.currentUser);
    return !this.fireAuth.auth.currentUser ? true : false;
  }

  private fireAuthUserSubscription(): void {
    this.fireAuth.user.subscribe(
      (user: firebase.User) => {
        this.fire.authUser = user;
      },
      (error: any) => {
        console.log('FirebaseService, delete, fireAuth.user, error', error);
      }
    );
  }

  /**
   * Gets firebase database
   * @param collection firebase collection name
   * @param refOnly indicates if db reference only should be returned
   */
  public getDB(collection: 'about'|'blog'|'blogEntriesIDs'|'brands'|'emails'|'freedownloads'|'users'|string, refOnly?: boolean): Promise<DataSnapshot>|DatabaseReference {
    const db: Promise<DataSnapshot>|DatabaseReference = (!refOnly) ? this.fireDB.database.ref('/' + collection).once('value') : this.fireDB.database.ref('/' + collection);
    // console.log('firebaseService, getDB', db);
    return db;
  }

  /**
   * Resolves if user has privileged access.
   */
  public privilegedAccess(): boolean {
    return (!this.fire.authUser) ? false : (this.fire.authUser.uid !== this.config.privilegedAccessUID) ? false : true;
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
    console.log('signout', this.fireAuth);
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
  public async delete(email: string, password: string): Promise<any> {
    const def = new CustomDeferredService<any>();
    const credential: any = await this.fireAuth.auth.signInAndRetrieveDataWithEmailAndPassword(email, password);

    this.fire.authUser.reauthenticateAndRetrieveDataWithCredential(credential)
      .then(() => {
        // console.log('successfully reauthenticated');
        (this.getDB('users/' + this.fire.authUser.uid, true) as DatabaseReference).remove(); // delete user db profile also
        this.fire.authUser.delete()
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

  /**
   * Checks authentication for errors.
   */
  public authErrorCheck(): void {
    const typeError = new TypeError('firebaseService, user DB record action error: there seems to be no authenticated users');
    if (!this.fireAuth.user) {
      throw typeError;
    } else if (this.fireAuth.user && !this.fire.authUser.uid) {
      throw typeError;
    }
  }

  /**
   * Checks database user id.
   */
  public checkDBuserUID() {
    const def = new CustomDeferredService<any>();
    this.authErrorCheck();
    (this.getDB('users/' + this.fire.authUser.uid) as Promise<DataSnapshot>)
      .then((snapshot: DataSnapshot) => {
        console.log('checking user db profile');
        if (!snapshot.val()) {
          console.log('creating user db profile');
          (this.getDB('users/' + this.fire.authUser.uid, true) as DatabaseReference)
            .set({
              created: new Date().getTime()
            })
            .then(() => {
              console.log('created user db profile');
              def.resolve({ exists: false, created: true });
            })
            .catch((error) => {
              console.log('error creating user db profile', error);
              def.reject({ exists: false, created: false });
            });
        } else {
          def.resolve({ exists: true, created: false });
        }
      })
      .catch((error) => {
        console.log('checkDBuserUID, user db profile check:', error);
        def.reject(error);
      });
    return def.promise;
  }

  /**
   * Resolves if blog entry exists by value
   * @param dbKey blog entry database key
   */
  public blogEntryExistsByValue(dbKey: string): Promise<any> {
    const def = new CustomDeferredService();
    (this.getDB('blogEntriesIDs', true) as DatabaseReference)
      .orderByValue()
      .equalTo(dbKey)
      .on('value', (snapshot: DatabaseSnapshotExists<any>) => {
        const response = snapshot.val();
        // console.log('blogEntryExists, blogEntriesIDs response', response);
        // null - not found
        def.resolve(response);
      });
    return def.promise;
  }

  /**
   * Resolves if blog entry exists by child value
   * @param childKey child key
   * @param value child key value
   */
  public blogEntryExistsByChildValue(childKey: string, value: any): Promise<any> {
    const def = new CustomDeferredService();
    (this.getDB('blog', true) as DatabaseReference)
      .orderByChild(childKey)
      .equalTo(value)
      .on('value', (snapshot) => {
        const response = snapshot.val();
        // console.log('blogEntryExists, blogEntriesIDs response', response);
        // null - not found
        def.resolve(response);
      });
    return def.promise;
  }

  /**
   * Adds blog post to database.
   * @param valuesObj blog post model
   */
  public addBlogPost(valuesObj: IBlogPost): Promise<any> {
    /*
    *	create new records, delete submission record
    */
    const def = new CustomDeferredService();
    this.authErrorCheck();
    this.checkDBuserUID()
      .then((data: any) => {
        console.log('checkDBuserUID', JSON.stringify(data));
        (this.getDB('blogEntriesIDs', true) as DatabaseReference)
          .orderByValue()
          .once('value', (snapshot: DataSnapshot) => {
            const idsArray = snapshot.val();
            console.log('idsArray', idsArray);
            idsArray[0].push(valuesObj.playlistId);
            (this.getDB('blogEntriesIDs', true) as DatabaseReference).set(idsArray) // update blog entries ids
              .then(() => {
                const newRecord = (this.getDB('blog', true) as DatabaseReference).push(); // update blog
                newRecord.set(valuesObj)
                  .then(() => {
                    console.log('blog post added');
                    def.resolve({ valuesSet: true });
                  })
                  .catch((error: any) => {
                    console.log('error adding blog post entry', error);
                    def.reject({ valuesSet: false });
                  });
              })
              .catch((error: any) => {
                console.log('error adding blog post entry ref to blogEntriesIDs collection', error);
                def.reject({ valuesSet: false });
              });
          });
      }).catch((error) => {
        console.log('addBlogPost, user db profile check error', error);
        def.reject(error);
      });
    return def.promise;
  }

}
