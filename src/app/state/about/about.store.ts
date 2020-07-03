import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';

import { DnbhubAboutDetails } from '../../interfaces/about/about-details.interface';
import { setDnbhubAboutState } from './about.actions';
import { IDnbhubAboutStateModel, TDnbhubAboutPayload } from './about.interface';

export const aboutActions = {
  setDnbhubAboutState,
};

export const ABOUT_STATE_TOKEN = new StateToken<IDnbhubAboutStateModel>('about');

@State<IDnbhubAboutStateModel>({
  name: ABOUT_STATE_TOKEN,
  defaults: {
    details: new DnbhubAboutDetails(),
  },
})
// eslint-disable-next-line @angular-eslint/use-injectable-provided-in
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
