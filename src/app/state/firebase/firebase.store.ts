import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { mapTo, switchMap } from 'rxjs/operators';

import { userActions } from '../user/user.actions';
import { firebaseActions } from './firebase.actions';
import {
  FIREBASE_STATE_TOKEN,
  firebaseInitialState,
  IDnbhubFirebaseStateModel,
  TDnbhubFirebasePayload,
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
  public readonly user$ = this.fireAuth.authState.pipe(
    untilDestroyed(this),
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
            .pipe(mapTo(user))
        : of(user);
    }),
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
}
