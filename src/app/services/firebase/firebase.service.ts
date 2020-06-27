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
import { DnbhubEnvironmentConfig } from 'src/app/app.environment';
import { IFirebaseEnvInterface } from 'src/app/interfaces';
import { DnbhubBlogPost } from 'src/app/interfaces/blog/blog-post.interface';
import { IFirebaseUserRecord } from 'src/app/interfaces/firebase';

import { DnbhubHttpHandlersService } from '../http-handlers/http-handlers.service';

/**
 * Firebase service, uses Angular Fire.
 */
@Injectable({
  providedIn: 'root',
})
export class DnbhubFirebaseService {
  constructor(
    private readonly fireDb: AngularFireDatabase,
    private readonly fireAuth: AngularFireAuth,
    private readonly handlers: DnbhubHttpHandlersService,
  ) {}

  /**
   * Application environment: Firebase API.
   */
  private readonly config: IFirebaseEnvInterface = new DnbhubEnvironmentConfig().firebase;

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
    user: null, // TODO remove this static reference to authenticated firebase user eventually
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
    return !Boolean(this.fire.user)
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
    if (!Boolean(this.fireAuth.user)) {
      throw typeError;
    } else if (Boolean(this.fireAuth.user) && !Boolean(this.fire.user.uid)) {
      throw typeError;
    }
  }

  /**
   * Checks database user id.
   */
  public checkDBuserUID(): Observable<{ exists: boolean; created: boolean }> {
    this.authErrorCheck();
    const checkRecord = (this.getDB('users/' + this.fire.user.uid) as Promise<DataSnapshot>)
      .then((snapshot: DataSnapshot) => {
        console.warn('checking user db profile', snapshot.val());
        return { exists: Boolean(snapshot.val()), created: false };
      })
      .catch(error => {
        throw error;
      });

    const checkRecordObservable = from(checkRecord);
    return checkRecordObservable.pipe(
      concatMap(result => {
        if (!result.exists) {
          const createRecord = (this.getDB(
            'users/' + this.fire.user.uid,
            true,
          ) as DatabaseReference)
            .set({
              created: new Date().getTime(),
            })
            .then(() => {
              console.warn('created user db profile');
              return { exists: false, created: true };
            })
            .catch(error => {
              throw error;
            });

          return from(createRecord);
        }
        return of(result);
      }),
    );
  }

  /**
   * Sets new values for database user.
   * @param valuesObj new values object
   */
  public setDBuserNewValues(valuesObj: Partial<IFirebaseUserRecord>) {
    const observable = this.checkDBuserUID().pipe(
      concatMap(result => {
        console.warn('checkDBuserUID', result);
        const promise = (this.getDB(
          'users/' + this.fire.user.uid,
          true,
        ) as DatabaseReference).update(valuesObj);
        return from(promise);
      }),
    );
    return this.handlers.pipeHttpRequest(observable);
  }

  /**
   * Resolves if blog entry exists by value
   * @param dbKey blog entry database key
   */
  public blogEntryExistsByValue(dbKey: string) {
    const observable = new Observable<DnbhubBlogPost>(subscriber => {
      (this.getDB('blogEntriesIDs', true) as DatabaseReference)
        .orderByValue()
        .equalTo(dbKey)
        .on('value', (snapshot: DatabaseSnapshotExists<DnbhubBlogPost>) => {
          const response = snapshot.val();
          console.warn('blogEntryExists, blogEntriesIDs response', response);
          // null - not found
          subscriber.next(response);
        });
    });
    return observable;
  }

  /**
   * Resolves if blog entry exists by child value
   * @param childKey child key
   * @param value child key value
   */
  public blogEntryExistsByChildValue(childKey: string, value: string | number | boolean) {
    const observable = new Observable<DnbhubBlogPost>(subscriber => {
      (this.getDB('blog', true) as DatabaseReference)
        .orderByChild(childKey)
        .equalTo(value)
        .on('value', (snapshot: DatabaseSnapshotExists<DnbhubBlogPost>) => {
          const response = snapshot.val();
          console.warn('blogEntryExists, blogEntriesIDs response', response);
          // null - not found
          subscriber.next(response);
        });
      return observable;
    });
  }

  /**
   * Adds blog post to database.
   * @param valuesObj blog post model
   */
  public addBlogPost(valuesObj: DnbhubBlogPost) {
    const observable = this.checkDBuserUID().pipe(
      concatMap(result => {
        const promise = (this.getDB('blogEntriesIDs', true) as DatabaseReference)
          .orderByValue()
          .once('value', (snapshot: DataSnapshot) => {
            const idsArray: [number[]] = snapshot.val();
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
                    return { valuesSet: true };
                  })
                  .catch(error => {
                    throw error;
                  });
              })
              .catch(error => {
                throw error;
              });
          });
        return from(promise);
      }),
    );
    return observable;
  }
}
