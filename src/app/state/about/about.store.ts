import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { DnbhubAboutDetails } from '../../interfaces/about/about-details.interface';
import { aboutActions } from './about.actions';
import { ABOUT_STATE_TOKEN, IDnbhubAboutStateModel, TDnbhubAboutPayload } from './about.interface';

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

  @Action(aboutActions.setDnbhubAboutState)
  public setDnbhubAboutState(
    ctx: StateContext<IDnbhubAboutStateModel>,
    { payload }: TDnbhubAboutPayload,
  ) {
    return ctx.patchState(payload);
  }
}
