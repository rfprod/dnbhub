import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';

import { startProgress, stopProgress } from './http-progress.actions';
import {
  IDnbhubHttpProgressStateModel,
  TDnbhubHttpProgressPayload,
} from './http-progress.interface';

export const httpProgressActions = {
  startProgress,
  stopProgress,
};

export const HTTP_PROGRESS_STATE_TOKEN = new StateToken<IDnbhubHttpProgressStateModel>(
  'httpProgress',
);

@State<IDnbhubHttpProgressStateModel>({
  name: HTTP_PROGRESS_STATE_TOKEN,
  defaults: {
    mainView: false,
  },
})
@Injectable({
  providedIn: 'root',
})
export class DnbhubHttpProgressState {
  @Selector()
  public static getState(state: IDnbhubHttpProgressStateModel) {
    return state;
  }

  @Selector()
  public static mainViewProgress(state: IDnbhubHttpProgressStateModel) {
    return state.mainView;
  }

  @Action(startProgress)
  public startProgress(
    ctx: StateContext<IDnbhubHttpProgressStateModel>,
    { payload }: TDnbhubHttpProgressPayload,
  ) {
    return ctx.patchState(payload);
  }

  @Action(stopProgress)
  public stopProgress(
    ctx: StateContext<IDnbhubHttpProgressStateModel>,
    { payload }: TDnbhubHttpProgressPayload,
  ) {
    return ctx.patchState(payload);
  }
}
