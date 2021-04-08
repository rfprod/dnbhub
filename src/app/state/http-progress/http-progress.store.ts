import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { httpProgressActions } from './http-progress.actions';
import {
  HTTP_PROGRESS_STATE_TOKEN,
  IDnbhubHttpProgressStateModel,
  TDnbhubHttpProgressPayload,
} from './http-progress.interface';

@State<IDnbhubHttpProgressStateModel>({
  name: HTTP_PROGRESS_STATE_TOKEN,
  defaults: {
    mainView: false,
  },
})
@Injectable()
export class DnbhubHttpProgressState {
  @Selector()
  public static getState(state: IDnbhubHttpProgressStateModel) {
    return state;
  }

  @Selector()
  public static mainViewProgress(state: IDnbhubHttpProgressStateModel) {
    return state.mainView;
  }

  @Action(httpProgressActions.startProgress)
  public startProgress(
    ctx: StateContext<IDnbhubHttpProgressStateModel>,
    { payload }: TDnbhubHttpProgressPayload,
  ) {
    return ctx.patchState(payload);
  }

  @Action(httpProgressActions.stopProgress)
  public stopProgress(
    ctx: StateContext<IDnbhubHttpProgressStateModel>,
    { payload }: TDnbhubHttpProgressPayload,
  ) {
    return ctx.patchState(payload);
  }
}
