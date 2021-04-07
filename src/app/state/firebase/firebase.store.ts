import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import { firebaseActions } from './firebase.actions';
import {
  FIREBASE_STATE_TOKEN,
  firebaseInitialState,
  IDnbhubFirebaseStateModel,
  TDnbhubFirebasePayload,
} from './firebase.interface';

@UntilDestroy()
@State<IDnbhubFirebaseStateModel>({
  name: FIREBASE_STATE_TOKEN,
  defaults: { ...firebaseInitialState },
})
@Injectable()
export class DnbhubFirebaseState {
  public readonly user$ = this.fireAuth.authState.pipe(
    untilDestroyed(this),
    tap(user => {
      console.log('user', user);
      // TODO: debug authorization
    }),
  );

  constructor(private readonly fireAuth: AngularFireAuth) {
    void this.user$.subscribe();
  }

  @Selector()
  public static getState(state: IDnbhubFirebaseStateModel) {
    return state;
  }

  @Selector()
  public static privilegedAccess(state: IDnbhubFirebaseStateModel) {
    return state.user?.uid === state.config.privilegedAccessUID;
  }

  @Action(firebaseActions.setState)
  public setState(
    ctx: StateContext<IDnbhubFirebaseStateModel>,
    { payload }: TDnbhubFirebasePayload,
  ) {
    return ctx.patchState(payload);
  }
}
