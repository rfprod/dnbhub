import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import { getUserRecord, setDnbhubUserState } from './user.actions';
import { IDnbhubUserStateModel, TDnbhubUserPayload, TGetUserPayload } from './user.interface';
import { DnbhubUserApiService } from './user-api.service';

export const userActions = {
  setDnbhubUserState,
  getUserRecord,
};

export const USER_STATE_TOKEN = new StateToken<IDnbhubUserStateModel>('user');

@State<IDnbhubUserStateModel>({
  name: USER_STATE_TOKEN,
  defaults: {
    firebaseId: '',
    firebaseUser: null,
  },
})
@Injectable()
export class DnbhubUserState {
  @Selector()
  public static getState(state: IDnbhubUserStateModel) {
    return state;
  }

  @Selector()
  public static firebaseId(state: IDnbhubUserStateModel) {
    return state.firebaseId;
  }

  @Selector()
  public static firebaseUser(state: IDnbhubUserStateModel) {
    return state.firebaseUser;
  }

  constructor(private readonly api: DnbhubUserApiService) {}

  @Action(setDnbhubUserState)
  public setDnbhubUserState(
    ctx: StateContext<IDnbhubUserStateModel>,
    { payload }: TDnbhubUserPayload,
  ) {
    ctx.patchState(payload);
  }

  @Action(getUserRecord)
  public getUser(ctx: StateContext<IDnbhubUserStateModel>, { payload }: TGetUserPayload) {
    const firebaseId = payload.id;
    void this.api
      .getUserRecord(firebaseId)
      .pipe(
        tap(firebaseUser => {
          ctx.patchState({ firebaseId, firebaseUser });
        }),
      )
      .subscribe();
  }
}
