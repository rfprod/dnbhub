import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import { firebaseActions } from '../firebase/firebase.actions';
import { userActions } from './user.actions';
import {
  IDnbhubUserStateModel,
  TDnbhubUserPayload,
  TGetUserPayload,
  TUpdateFirebaseProfilePayload,
  USER_STATE_TOKEN,
} from './user.interface';
import { DnbhubUserApiService } from './user-api.service';

@State<IDnbhubUserStateModel>({
  name: USER_STATE_TOKEN,
  defaults: {
    firebaseUser: null,
  },
})
@Injectable()
export class DnbhubUserState {
  constructor(private readonly store: Store, private readonly api: DnbhubUserApiService) {}

  @Selector()
  public static getState(state: IDnbhubUserStateModel) {
    return state;
  }

  @Selector()
  public static firebaseUser(state: IDnbhubUserStateModel) {
    return state.firebaseUser;
  }

  @Action(userActions.setDnbhubUserState)
  public setDnbhubUserState(
    ctx: StateContext<IDnbhubUserStateModel>,
    { payload }: TDnbhubUserPayload,
  ) {
    ctx.patchState(payload);
  }

  @Action(userActions.getUserRecord)
  public getUser(ctx: StateContext<IDnbhubUserStateModel>, { payload }: TGetUserPayload) {
    void this.api
      .getUserRecord(payload.userInfo.uid)
      .pipe(
        tap(firebaseUser => {
          ctx.patchState({ firebaseUser });
          void this.store.dispatch(new firebaseActions.setState({ userInfo: payload.userInfo }));
        }),
      )
      .subscribe();
  }

  @Action(userActions.updateFirebaseProfile)
  public updateFirebaseProfile(
    ctx: StateContext<IDnbhubUserStateModel>,
    { payload }: TUpdateFirebaseProfilePayload,
  ) {
    void this.api.updateProfile(payload).subscribe();
  }
}
