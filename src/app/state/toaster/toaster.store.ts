import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { hideToaster, showToaster } from './toaster.actions';
import {
  IDnbhubToasterStateModel,
  TDnbhubToasterPayload,
  TOASTER_STATE_TOKEN,
  toasterStateDefaultValues,
} from './toaster.interface';
import { DnbhubToasterService } from './toaster.service';

export const toasterActions = {
  hideToaster,
  showToaster,
};

@State<IDnbhubToasterStateModel>({
  name: TOASTER_STATE_TOKEN,
  defaults: { ...toasterStateDefaultValues },
})
@Injectable()
export class DnbhubToasterState {
  constructor(private readonly toaster: DnbhubToasterService) {}

  @Selector()
  public static getState(state: IDnbhubToasterStateModel) {
    return state;
  }

  @Action(showToaster)
  public showToaster(
    ctx: StateContext<IDnbhubToasterStateModel>,
    { payload }: TDnbhubToasterPayload,
  ) {
    this.toaster.showToaster(payload.message ?? '', payload.type, payload.duration);
    return ctx.patchState(payload);
  }

  @Action(hideToaster)
  public hideToaster(
    ctx: StateContext<IDnbhubToasterStateModel>,
    { payload }: TDnbhubToasterPayload,
  ) {
    this.toaster.hideToaster();
    return ctx.patchState(payload);
  }
}
