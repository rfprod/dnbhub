import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { startProgress, stopProgress } from './http-progress.actions';
import { HttpProgressPayload, IHttpProgressStateModel } from './http-progress.interface';

export const httpProgressActions = {
  startProgress,
  stopProgress,
};

@State<IHttpProgressStateModel>({
  name: 'httpProgress',
  defaults: {
    mainView: false,
  },
})
@Injectable({
  providedIn: 'root',
})
export class HttpProgressState {
  @Selector()
  public static getState(state: IHttpProgressStateModel) {
    return state;
  }

  @Selector()
  public static mainViewProgress(state: IHttpProgressStateModel) {
    return state.mainView;
  }

  @Action(startProgress)
  public startProgress(
    ctx: StateContext<IHttpProgressStateModel>,
    { payload }: HttpProgressPayload,
  ) {
    return ctx.patchState(payload);
  }

  @Action(stopProgress)
  public stopProgress(
    ctx: StateContext<IHttpProgressStateModel>,
    { payload }: HttpProgressPayload,
  ) {
    return ctx.patchState(payload);
  }
}
