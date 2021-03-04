import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase, QueryFn } from '@angular/fire/database';
import { QueryReference } from '@angular/fire/database/interfaces';
import { from, Observable, of, throwError } from 'rxjs';
import { concatMap, filter, first, map, mapTo, switchMap, tap } from 'rxjs/operators';
import { DnbhubEnvironmentConfig } from 'src/app/app.environment';
import { IFirebaseEnvInterface } from 'src/app/interfaces';
import { DnbhubBlogPost } from 'src/app/interfaces/blog/blog-post.interface';
import { IFirebaseUserRecord, newFirebaseUserRecord } from 'src/app/interfaces/firebase';

import { DnbhubHttpHandlersService } from '../http-handlers/http-handlers.service';
import { queries } from './firebase.queries';

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
    auth: AngularFireAuth;
    user: firebase.default.User | null;
  } = {
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

  public getListStream<T = unknown>(collection: TFirebaseDbCollection, query?: QueryFn) {
    return this.fireDb.list<T>('/' + collection, query).valueChanges();
  }

  public getList<T = unknown>(collection: TFirebaseDbCollection, query?: QueryFn) {
    return this.fireDb.list<T>('/' + collection, query);
  }

  public getListItem<T = unknown>(path: QueryReference | string) {
    return this.fireDb.object<T>(`/${path}`);
  }

  public blogEntryExistsByValue(childKey: string) {
    const query: QueryFn = queries.orderByValueEqChildKey(childKey);
    return this.getList<DnbhubBlogPost>('blog', query)
      .valueChanges()
      .pipe(
        map(items => {
          const result: DnbhubBlogPost = items[0];
          // console.warn('blogEntryExistsByValue', result);
          return Boolean(result);
        }),
      );
  }

  public blogEntryExistsByChildValue(childKey: string, value: string | number | boolean) {
    const query: QueryFn = (ref: firebase.default.database.Reference) =>
      ref.orderByChild(childKey).equalTo(value);
    return this.getList<DnbhubBlogPost>('blog', query)
      .valueChanges()
      .pipe(
        map(items => {
          const result: DnbhubBlogPost = items[0];
          // console.warn('blogEntryExistsByChildValue', result);
          return Boolean(result);
        }),
      );
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
      switchMap(user => from(this.getList(`users/${user.uid}`).remove()).pipe(mapTo(user))),
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
  public checkDBuserUID() {
    void this.authErrorCheck().subscribe();
    const checkRecord = this.getListStream<{ [key: string]: IFirebaseUserRecord }>(
      `users/${this.fire.user?.uid ?? ''}`,
    );
    return checkRecord.pipe(
      first(),
      map(user => {
        // console.warn('checking user db profile', user);
        return { exists: typeof user !== 'undefined', created: false };
      }),
      concatMap(result => {
        if (!result.exists) {
          const observable = from(
            this.getList<IFirebaseUserRecord>(`users/${this.fire.user?.uid ?? ''}`).push(
              newFirebaseUserRecord,
            ),
          ).pipe(mapTo({ exists: false, created: true }));

          return observable;
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
        // console.warn('checkDBuserUID', result);
        const observable1 = from(
          this.getList<IFirebaseUserRecord>('users').update(
            // this.getList<IFirebaseUserRecord>(`users/${this.fire.user?.uid ?? ''}`).update(
            this.fire.user?.uid ?? '',
            valuesObj,
          ),
        );
        return observable1;
      }),
    );
    return this.handlers.pipeHttpRequest(observable);
  }

  /**
   * Adds blog post to database.
   * @param valuesObj blog post model
   */
  public addBlogPost(valuesObj: DnbhubBlogPost) {
    const observable = this.checkDBuserUID().pipe(
      filter(result => result.exists),
      concatMap(result => {
        if (!result.exists) {
          const observable1 = from(this.getList<DnbhubBlogPost>('blog').push(valuesObj)).pipe(
            mapTo({ valuesSet: true }),
          ); // update blog
          return observable1;
        }
        return of(null);
      }),
    );
    return observable;
  }
}
