import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Navigate, RouterState } from '@ngxs/router-plugin';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { mapTo, switchMap, tap } from 'rxjs/operators';

import { userActions } from '../user/user.actions';
import { firebaseActions } from './firebase.actions';
import {
  FIREBASE_STATE_TOKEN,
  firebaseInitialState,
  IDnbhubFirebaseStateModel,
  TDnbhubFirebasePayload,
  TEmailSignInPayload,
  TResetPasswordPayload,
} from './firebase.interface';
import { DnbhubFirebaseService } from './firebase.service';

@UntilDestroy()
@State<IDnbhubFirebaseStateModel>({
  name: FIREBASE_STATE_TOKEN,
  defaults: { ...firebaseInitialState },
})
@Injectable()
export class DnbhubFirebaseState {
  public readonly user$ = this.fireAuth.user.pipe(
    switchMap(user => {
      return user !== null
        ? this.store
            .dispatch(
              new userActions.getUserRecord({
                userInfo: {
                  displayName: user.displayName,
                  email: user.email,
                  phoneNumber: user.phoneNumber,
                  photoURL: user.photoURL,
                  providerId: user.providerId,
                  uid: user.uid,
                  emailVerified: user.emailVerified,
                },
              }),
            )
            .pipe(
              tap(() => {
                void this.store.dispatch(new Navigate(['/user']));
              }),
              mapTo(user),
            )
        : this.store.dispatch(new firebaseActions.setState({ userInfo: null })).pipe(
            tap(() => {
              void this.store
                .selectOnce(RouterState.url)
                .pipe(
                  tap(url => {
                    if (typeof url !== 'undefined') {
                      if (/(user|admin)/.test(url)) {
                        void this.store.dispatch(new Navigate(['/index']));
                      }
                    }
                  }),
                )
                .subscribe();
            }),
            mapTo(user),
          );
    }),
    untilDestroyed(this),
  );

  constructor(
    private readonly store: Store,
    private readonly fireAuth: AngularFireAuth,
    private readonly fireSrv: DnbhubFirebaseService,
  ) {
    void this.user$.subscribe();
  }

  @Selector()
  public static getState(state: IDnbhubFirebaseStateModel) {
    return state;
  }

  @Selector()
  public static userInfo(state: IDnbhubFirebaseStateModel) {
    return state.userInfo;
  }

  @Selector()
  public static privilegedAccess(state: IDnbhubFirebaseStateModel) {
    return state.userInfo?.uid === state.config.privilegedAccessUID;
  }

  @Action(firebaseActions.setState)
  public setState(
    ctx: StateContext<IDnbhubFirebaseStateModel>,
    { payload }: TDnbhubFirebasePayload,
  ) {
    return ctx.patchState(payload);
  }

  @Action(firebaseActions.sendPasswordResetEmail)
  public sendPasswordResetEmail(
    ctx: StateContext<IDnbhubFirebaseStateModel>,
    { payload }: TResetPasswordPayload,
  ) {
    return this.fireSrv.sendPasswordResetEmail(payload.email);
  }

  @Action(firebaseActions.emailSignIn)
  public emailSignIn(
    ctx: StateContext<IDnbhubFirebaseStateModel>,
    { payload }: TEmailSignInPayload,
  ) {
    return this.fireSrv.authenticate('email', payload.email, payload.password);
  }

  @Action(firebaseActions.signOut)
  public signOut() {
    return this.fireSrv.signOut();
  }
}
