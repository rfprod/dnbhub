/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import {
  DatabaseReference,
  DatabaseSnapshotExists,
  DataSnapshot,
} from '@angular/fire/database/interfaces';
import { from, Observable, of, throwError } from 'rxjs';
import { concatMap, map, tap } from 'rxjs/operators';
import { AppEnvironmentConfig } from 'src/app/app.environment';
import { IFirebaseENVInterface } from 'src/app/interfaces';
import { BlogPost } from 'src/app/interfaces/blog/blog-post.interface';
import { IFirebaseUserRecord } from 'src/app/interfaces/firebase';
import { CustomDeferredService } from 'src/app/services/custom-deferred/custom-deferred.service';

import { HttpHandlersService } from '../http-handlers/http-handlers.service';

/**
 * Firebase service, uses Angular Fire.
 */
@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(
    private readonly fireDb: AngularFireDatabase,
    private readonly fireAuth: AngularFireAuth,
    private readonly handlers: HttpHandlersService,
  ) {}

  /**
   * Application environment: Firebase API.
   */
  private readonly config: IFirebaseENVInterface = new AppEnvironmentConfig().firebase;

  /**
   * Angular fire public shortcuts.
   */
  public fire: {
    db: firebase.database.Database;
    auth: AngularFireAuth;
    user: firebase.User;
  } = {
    db: this.fireDb.database,
    auth: this.fireAuth,
    user: null, // TODO remove this static reference of authenticated firebase user eventually
  };

  public readonly user$: Observable<firebase.User> = this.fireAuth.user;

  public readonly anonUser$: Observable<boolean> = this.fireAuth.authState.pipe(
    // TODO: remove this and refactor firebase user scenarios
    tap(user => {
      this.fire.user = { ...user };
    }),
    map(user => !Boolean(user)),
  );

  public readonly privilegedAccess$: Observable<boolean> = this.fireAuth.user.pipe(
    map(user => user.uid !== this.config.privilegedAccessUID),
  );

  /**
   * Gets firebase database
   * @param collection firebase collection name
   * @param refOnly indicates if db reference only should be returned
   */
  public getDB(
    collection:
      | 'about'
      | 'blog'
      | 'blogEntriesIDs'
      | 'brands'
      | 'emails'
      | 'freedownloads'
      | 'users'
      | string,
    refOnly?: boolean,
  ): Promise<DataSnapshot> | DatabaseReference {
    const db: Promise<DataSnapshot> | DatabaseReference = !refOnly
      ? this.fireDb.database.ref('/' + collection).once('value')
      : this.fireDb.database.ref('/' + collection);
    // console.warn('firebaseService, getDB', db);
    return db;
  }

  /**
   * Authenticates user with provided credentials.
   * @param mode login mode
   * @param payload login payload
   */
  public authenticate(mode: 'email' | 'twitter', email: string, password: string) {
    const promise = this.fireAuth
      .signInWithEmailAndPassword(email, password)
      .then(credential => credential);

    const observable =
      mode === 'email'
        ? from(promise)
        : throwError(
            'TODO: Twitter authentication - https://firebase.google.com/docs/auth/web/twitter-login?authuser=0',
          );
    return this.handlers.pipeHttpRequest(observable);
  }

  /**
   * Signs user out.
   */
  public signout() {
    const observable = from(this.fireAuth.currentUser).pipe(
      concatMap(user => {
        if (Boolean(user)) {
          return from(this.fireAuth.signOut());
        }
        return of<void>();
      }),
    );
    return this.handlers.pipeHttpRequest(observable);
  }

  /**
   * @deprecated
   * privilegedAccess$ should be used instead.
   */
  public privilegedAccess(): boolean {
    return !this.fire.user
      ? false
      : this.fire.user.uid !== this.config.privilegedAccessUID
      ? false
      : true;
  }

  /**
   * Creates a user
   * @param email user email
   * @param password user password
   */
  public create(email: string, password: string) {
    const promise = this.fireAuth.createUserWithEmailAndPassword(email, password);
    const observable = from(promise);
    return this.handlers.pipeHttpRequest<firebase.auth.UserCredential>(observable);
  }

  /**
   * Sends password reset link to user's email.
   * @param email user email
   */
  public resetUserPassword(email: string) {
    const promise = this.fireAuth.sendPasswordResetEmail(email);
    const observable = from(promise);
    return this.handlers.pipeHttpRequest(observable);
  }

  /**
   * Deletes a user
   * @param email user email
   * @param password user password
   */
  public delete(email: string, password: string) {
    const promise = this.fireAuth
      .signInWithEmailAndPassword(email, password)
      .then(credential => {
        const cred = (credential as unknown) as firebase.auth.AuthCredential;
        return this.fire.user.reauthenticateAndRetrieveDataWithCredential(cred);
      })

      .then(() => {
        // console.warn('successfully reauthenticated');
        return (this.getDB('users/' + this.fire.user.uid, true) as DatabaseReference).remove(); // delete user db profile also
      })
      .then(() => {
        return this.fire.user.delete();
      });
    const observable = from(promise);
    return this.handlers.pipeHttpRequest(observable);
  }

  /**
   * Checks authentication for errors.
   */
  public authErrorCheck(): void {
    const typeError = new TypeError(
      'firebaseService, user DB record action error: there seems to be no authenticated users',
    );
    if (!this.fireAuth.user) {
      throw typeError;
    } else if (this.fireAuth.user && !Boolean(this.fire.user.uid)) {
      throw typeError;
    }
  }

  /**
   * Checks database user id.
   */
  public checkDBuserUID(): Promise<{ exists: boolean; created: boolean } | any> {
    const def = new CustomDeferredService<any>();
    this.authErrorCheck();
    (this.getDB('users/' + this.fire.user.uid) as Promise<DataSnapshot>)
      .then((snapshot: DataSnapshot) => {
        console.warn('checking user db profile');
        if (!Boolean(snapshot.val())) {
          console.warn('creating user db profile');
          (this.getDB('users/' + this.fire.user.uid, true) as DatabaseReference)
            .set({
              created: new Date().getTime(),
            })
            .then(() => {
              console.warn('created user db profile');
              def.resolve({ exists: false, created: true });
            })
            .catch(error => {
              console.warn('error creating user db profile', error);
              def.reject({ exists: false, created: false });
            });
        } else {
          def.resolve({ exists: true, created: false });
        }
      })
      .catch(error => {
        console.warn('checkDBuserUID, user db profile check:', error);
        def.reject(error);
      });
    return def.promise;
  }

  /**
   * Sets new values for database user.
   * @param valuesObj new values object
   */
  public setDBuserNewValues(valuesObj: Partial<IFirebaseUserRecord>) {
    this.authErrorCheck();
    const promise = this.checkDBuserUID().then(data => {
      console.warn('checkDBuserUID', JSON.stringify(data));
      return (this.getDB('users/' + this.fire.user.uid, true) as DatabaseReference)
        .update(valuesObj)
        .then(() => {
          console.warn('user db profile values set');
          return { valuesSet: true };
        });
    });
    const observable = from(promise);
    return this.handlers.pipeHttpRequest(observable);
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
        // console.warn('blogEntryExists, blogEntriesIDs response', response);
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
      .on('value', snapshot => {
        const response = snapshot.val();
        // console.warn('blogEntryExists, blogEntriesIDs response', response);
        // null - not found
        def.resolve(response);
      });
    return def.promise;
  }

  /**
   * Adds blog post to database.
   * @param valuesObj blog post model
   */
  public addBlogPost(valuesObj: BlogPost): Promise<any> {
    /*
     *	create new records, delete submission record
     */
    const def = new CustomDeferredService();
    this.authErrorCheck();
    this.checkDBuserUID()
      .then((data: any) => {
        console.warn('checkDBuserUID', JSON.stringify(data));
        (this.getDB('blogEntriesIDs', true) as DatabaseReference)
          .orderByValue()
          .once('value', (snapshot: DataSnapshot) => {
            const idsArray = snapshot.val();
            console.warn('idsArray', idsArray);
            idsArray[0].push(valuesObj.playlistId);
            (this.getDB('blogEntriesIDs', true) as DatabaseReference)
              .set(idsArray) // update blog entries ids
              .then(() => {
                const newRecord = (this.getDB('blog', true) as DatabaseReference).push(); // update blog
                newRecord
                  .set(valuesObj)
                  .then(() => {
                    console.warn('blog post added');
                    def.resolve({ valuesSet: true });
                  })
                  .catch((error: any) => {
                    console.warn('error adding blog post entry', error);
                    def.reject({ valuesSet: false });
                  });
              })
              .catch((error: any) => {
                console.warn(
                  'error adding blog post entry ref to blogEntriesIDs collection',
                  error,
                );
                def.reject({ valuesSet: false });
              });
          });
      })
      .catch(error => {
        console.warn('addBlogPost, user db profile check error', error);
        def.reject(error);
      });
    return def.promise;
  }
}
