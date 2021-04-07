import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase, QueryFn } from '@angular/fire/database';
import { QueryReference } from '@angular/fire/database/interfaces';
import firebase from 'firebase';
import { from, of, throwError } from 'rxjs';
import { concatMap, first, map, mapTo, switchMap } from 'rxjs/operators';
import { DnbhubBlogPost } from 'src/app/interfaces/blog/blog-post.interface';
import { IFirebaseUserRecord, newFirebaseUserRecord } from 'src/app/interfaces/firebase';

import { DnbhubHttpHandlersService } from '../../services/http-handlers/http-handlers.service';
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
    public readonly fireDb: AngularFireDatabase,
    public readonly fireAuth: AngularFireAuth,
    private readonly handlers: DnbhubHttpHandlersService,
  ) {}

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
          return Boolean(result);
        }),
      );
  }

  public blogEntryExistsByChildValue(childKey: string, value: string | number | boolean) {
    const query: QueryFn = (ref: firebase.database.Reference) =>
      ref.orderByChild(childKey).equalTo(value);
    return this.getList<DnbhubBlogPost>('blog', query)
      .valueChanges()
      .pipe(
        map(items => {
          const result: DnbhubBlogPost = items[0];
          return Boolean(result);
        }),
      );
  }

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
    const observable = from(this.fireAuth.signInWithEmailAndPassword(email, password));
    return this.handlers.pipeHttpRequest(observable).pipe(
      switchMap((credential: firebase.auth.UserCredential) =>
        this.fireAuth.user.pipe(map(user => ({ credential, user }))),
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
   * Checks database user id.
   */
  public checkDBuserUID() {
    const checkRecord = this.fireAuth.user.pipe(
      first(),
      switchMap(user =>
        this.getListStream<{ [key: string]: IFirebaseUserRecord }>(`users/${user?.uid ?? ''}`).pipe(
          mapTo(user),
        ),
      ),
    );
    return checkRecord.pipe(
      first(),
      map(user => {
        return { user, created: false };
      }),
      concatMap(result => {
        const user = result.user;
        if (user !== null) {
          const observable = from(
            this.getList<IFirebaseUserRecord>(`users/${user.uid}`).push(newFirebaseUserRecord),
          ).pipe(mapTo({ user, created: true }));

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
        const observable1 = from(
          this.getList<IFirebaseUserRecord>('users').update(result.user?.uid ?? '', valuesObj),
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
      concatMap(result => {
        const user = result.user;
        if (user !== null) {
          const observable1 = from(this.getList<DnbhubBlogPost>('blog').push(valuesObj)).pipe(
            mapTo({ valuesSet: true }),
          );
          return observable1;
        }
        return of(null);
      }),
    );
    return observable;
  }
}
