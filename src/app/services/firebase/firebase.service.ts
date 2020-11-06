/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { DataSnapshot } from '@angular/fire/database/interfaces';
import { from, Observable, of, throwError } from 'rxjs';
import { concatMap, first, map, mapTo, switchMap, tap } from 'rxjs/operators';
import { DnbhubEnvironmentConfig } from 'src/app/app.environment';
import { IFirebaseEnvInterface } from 'src/app/interfaces';
import { DnbhubBlogPost } from 'src/app/interfaces/blog/blog-post.interface';
import { IFirebaseUserRecord } from 'src/app/interfaces/firebase';

import { DnbhubHttpHandlersService } from '../http-handlers/http-handlers.service';

type TFirebaseDbCollection =
  | 'about'
  | 'blog'
  | 'blogEntriesIDs'
  | 'brands'
  | 'emails'
  | 'freedownloads'
  | 'users'
  | string;

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
    db: AngularFireDatabase['database'];
    auth: AngularFireAuth;
    user: firebase.default.User | null;
  } = {
    db: this.fireDb.database,
    auth: this.fireAuth,
    user: null, // TODO remove this static reference to authenticated firebase user eventually
  };

  public readonly user$: Observable<firebase.default.User | null> = this.fireAuth.user;

  public readonly anonUser$: Observable<boolean> = this.fireAuth.authState.pipe(
    tap(user => {
      this.fire.user = user;
    }),
    map(user => !Boolean(user)),
  );

  public readonly privilegedAccess$: Observable<boolean> = this.user$.pipe(
    map(user => user !== null && user.uid !== this.config.privilegedAccessUID),
  );

  /**
   * Gets firebase database
   * @param collection firebase collection name
   * @param refOnly indicates if db reference only should be returned
   */
  public getDB(
    collection: TFirebaseDbCollection,
    refOnly?: boolean,
  ): Promise<firebase.default.database.DataSnapshot> | firebase.default.database.ThenableReference {
    const db:
      | Promise<firebase.default.database.DataSnapshot>
      | firebase.default.database.ThenableReference = !Boolean(refOnly)
      ? (this.getDB('/' + collection) as firebase.default.database.ThenableReference).once('value')
      : (this.getDB('/' + collection, true) as firebase.default.database.ThenableReference);
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
      : this.fire.user?.uid !== this.config.privilegedAccessUID
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
    return this.handlers.pipeHttpRequest<firebase.default.auth.UserCredential>(observable);
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
    const observable = from(this.fireAuth.signInWithEmailAndPassword(email, password));
    return this.handlers.pipeHttpRequest(observable).pipe(
      switchMap((credential: firebase.default.auth.UserCredential) =>
        this.user$.pipe(map(user => ({ credential, user }))),
      ),
      switchMap(({ credential, user }) => {
        return user !== null && credential.credential !== null
          ? from(user.reauthenticateWithCredential(credential.credential)).pipe(mapTo(user))
          : throwError(new Error('Firebase user is undefined or auth credential is null.'));
      }),
      switchMap(user =>
        from(
          (this.getDB(
            `users/${user.uid}`,
            true,
          ) as firebase.default.database.ThenableReference).remove(),
        ).pipe(mapTo(user)),
      ),
      switchMap(user => {
        return typeof user !== 'undefined' ? from(user.delete()) : of(null);
      }),
    );
  }

  /**
   * Checks authentication for errors.
   */
  public authErrorCheck() {
    const typeError = new TypeError(
      'firebaseService, user DB record action error: there seems to be no authenticated users',
    );
    return this.user$.pipe(
      first(),
      tap(user => {
        if (user === null) {
          throw typeError;
        } else if (Boolean(this.fireAuth.user) && !Boolean(this.fire.user?.uid)) {
          throw typeError;
        }
      }),
    );
  }

  /**
   * Checks database user id.
   */
  public checkDBuserUID(): Observable<{ exists: boolean; created: boolean }> {
    void this.authErrorCheck().subscribe();
    const checkRecord = this.getDB('users/' + (this.fire.user?.uid ?? ''))
      .once('value')
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
          const createRecord = this.getDB('users/' + (this.fire.user?.uid ?? ''))
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
        const promise = this.getDB('users/' + (this.fire.user?.uid ?? '')).update(valuesObj);
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
      this.getDB('blogEntriesIDs')
        .orderByValue()
        .equalTo(dbKey)
        .on('value', snapshot => {
          const response: DnbhubBlogPost = snapshot.val();
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
      this.getDB('blog')
        .orderByChild(childKey)
        .equalTo(value)
        .on('value', snapshot => {
          const response: DnbhubBlogPost = snapshot.val();
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
        const promise = this.getDB('blogEntriesIDs')
          .orderByValue()
          .once('value', (snapshot: DataSnapshot) => {
            const idsArray: [number[]] = snapshot.val();
            console.warn('idsArray', idsArray);
            idsArray[0].push(valuesObj.playlistId ?? 0);
            this.getDB('blogEntriesIDs')
              .set(idsArray) // update blog entries ids
              .then(() => {
                const newRecord = this.getDB('blog').push(); // update blog
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
