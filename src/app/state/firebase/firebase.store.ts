import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { mapTo, switchMap, tap } from 'rxjs/operators';

import { firebaseActions } from './firebase.actions';
import {
  FIREBASE_STATE_TOKEN,
  firebaseInitialState,
  IDnbhubFirebaseStateModel,
  TDnbhubFirebasePayload,
  TEmailSignInPayload,
  TResetPasswordPayload,
  TSetUserRecordPayload,
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
    switchMap(userData => {
      return userData !== null
        ? of(userData).pipe(
            switchMap(user =>
              this.store
                .dispatch(
                  new firebaseActions.setState({
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
                .pipe(mapTo(userData)),
            ),
            switchMap(user => {
              const userInfo = {
                displayName: user.displayName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                photoURL: user.photoURL,
                providerId: user.providerId,
                uid: user.uid,
                emailVerified: user.emailVerified,
              };
              return this.api.getUserRecord(user.uid).pipe(
                tap(userRecord => {
                  void this.store.dispatch(new firebaseActions.setState({ userRecord }));
                }),
                mapTo(userInfo),
              );
            }),
          )
        : of(userData);
    }),
    untilDestroyed(this),
  );

  constructor(
    private readonly store: Store,
    private readonly fireAuth: AngularFireAuth,
    private readonly api: DnbhubFirebaseService,
  ) {
    void this.user$.subscribe();
  }

  @Selector()
  public static getState(state: IDnbhubFirebaseStateModel) {
    return state;
  }

  @Selector()
  public static userRecord(state: IDnbhubFirebaseStateModel) {
    return state.userRecord;
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

  @Action(firebaseActions.setUserRecord)
  public setUserRecord(
    ctx: StateContext<IDnbhubFirebaseStateModel>,
    { payload }: TSetUserRecordPayload,
  ) {
    return ctx.patchState({ userRecord: payload.userRecord });
  }

  @Action(firebaseActions.sendPasswordResetEmail)
  public sendPasswordResetEmail(
    ctx: StateContext<IDnbhubFirebaseStateModel>,
    { payload }: TResetPasswordPayload,
  ) {
    return this.api.sendPasswordResetEmail(payload.email);
  }

  @Action(firebaseActions.emailSignIn)
  public emailSignIn(
    ctx: StateContext<IDnbhubFirebaseStateModel>,
    { payload }: TEmailSignInPayload,
  ) {
    return this.api.authenticate('email', payload.email, payload.password);
  }

  @Action(firebaseActions.signOut)
  public signOut() {
    return this.api.signOut();
  }
}
