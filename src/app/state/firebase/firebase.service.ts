import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase, QueryFn } from '@angular/fire/database';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngxs/store';
import firebase from 'firebase';
import { from, of, throwError } from 'rxjs';
import { concatMap, first, map, mapTo, switchMap, tap } from 'rxjs/operators';

import { DnbhubBlogPost } from '../../interfaces/blog/blog-post.interface';
import { IFirebaseUserRecord, newFirebaseUserRecord } from '../../interfaces/firebase';
import { DnbhubHttpHandlersService } from '../../services/http-handlers/http-handlers.service';
import { httpProgressActions } from '../../state/http-progress/http-progress.actions';
import { toasterActions } from '../toaster/toaster.actions';
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

@Injectable({
  providedIn: 'root',
})
export class DnbhubFirebaseService {
  constructor(
    private readonly store: Store,
    public readonly fireDb: AngularFireDatabase,
    public readonly fireAuth: AngularFireAuth,
    private readonly handlers: DnbhubHttpHandlersService,
    private readonly snackBar: MatSnackBar,
  ) {}

  public getListStream<T = unknown>(collection: TFirebaseDbCollection, query?: QueryFn) {
    return this.fireDb.list<T>(`/${collection}`, query).valueChanges();
  }

  public getList<T = unknown>(collection: TFirebaseDbCollection, query?: QueryFn) {
    return this.fireDb.list<T>(`/${collection}`, query);
  }

  public getListItem<T = unknown>(path: TFirebaseDbCollection | string) {
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
            () =>
              new Error(
                'TODO: Twitter authentication - https://firebase.google.com/docs/auth/web/twitter-login?authuser=0',
              ),
          );
    return this.handlers.pipeHttpRequest(observable);
  }

  public signOut() {
    const observable = this.fireAuth.user.pipe(
      first(),
      switchMap(user => {
        if (Boolean(user)) {
          return from(this.fireAuth.signOut());
        }
        return of(null);
      }),
    );
    return this.handlers.pipeHttpRequest(observable);
  }

  /**
   * Creates a user.
   */
  public create(email: string, password: string) {
    const promise = this.fireAuth.createUserWithEmailAndPassword(email, password);
    const observable = from(promise);
    return this.handlers.pipeHttpRequest<firebase.auth.UserCredential>(observable);
  }

  public sendPasswordResetEmail(email: string) {
    const duration = 1000;
    const promise = this.fireAuth
      .sendPasswordResetEmail(email)
      .then(() => {
        const message = `Password reset email was sent to ${email}. It may take some time for the email to be delivered. Request it again if you do not receive it in about 15 minutes.`;
        this.snackBar.open(message, void 0, { duration });
      })
      .catch(error => {
        this.snackBar.open(error, void 0, { duration });
      });
    const observable = from(promise);
    return this.handlers.pipeHttpRequest(observable);
  }

  /**
   * Deletes a user.
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
          : throwError(() => new Error('Firebase user is undefined or auth credential is null.'));
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

  public getUserRecord(id: string) {
    const observable = this.getListItem<IFirebaseUserRecord>(`users/${id}`)
      .valueChanges()
      .pipe(
        first(),
        map(user => <IFirebaseUserRecord>user),
      );
    return this.handlers.pipeHttpRequest<IFirebaseUserRecord>(observable);
  }

  public updateProfile(options: { displayName: string }) {
    const firebaseUser = this.fireAuth.user;
    if (firebaseUser !== null) {
      void this.store.dispatch(new httpProgressActions.startProgress({ mainView: true }));
      const observable = firebaseUser.pipe(
        switchMap(user => {
          return user !== null
            ? from(user.updateProfile({ displayName: options.displayName }))
            : of(null);
        }),
      );
      return this.handlers.pipeHttpRequest<void | null>(observable).pipe(
        tap({
          next: () => {
            void this.store.dispatch(
              new toasterActions.showToaster({
                show: true,
                message: 'Your profile was updated.',
                type: 'success',
              }),
            );
          },
          error: (error: Error) => {
            void this.store.dispatch(
              new toasterActions.showToaster({ show: true, message: error.message, type: 'error' }),
            );
          },
          complete: () => {
            void this.store.dispatch(new httpProgressActions.startProgress({ mainView: false }));
          },
        }),
      );
    }
    return of(null);
  }
}
