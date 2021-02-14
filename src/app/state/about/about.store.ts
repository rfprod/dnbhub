import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { DnbhubAboutDetails } from '../../interfaces/about/about-details.interface';
import { setDnbhubAboutState } from './about.actions';
import { ABOUT_STATE_TOKEN, IDnbhubAboutStateModel, TDnbhubAboutPayload } from './about.interface';

export const aboutActions = {
  setDnbhubAboutState,
};

@State<IDnbhubAboutStateModel>({
  name: ABOUT_STATE_TOKEN,
  defaults: {
    details: new DnbhubAboutDetails(),
  },
})
@Injectable()
export class DnbhubAboutState {
  @Selector()
  public static getState(state: IDnbhubAboutStateModel) {
    return state;
  }

  @Selector()
  public static getDetails(state: IDnbhubAboutStateModel) {
    return state.details;
  }

  @Action(setDnbhubAboutState)
  public setDnbhubAboutState(
    ctx: StateContext<IDnbhubAboutStateModel>,
    { payload }: TDnbhubAboutPayload,
  ) {
    return ctx.patchState(payload);
  }
}
