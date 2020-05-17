import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';

import { AboutDetails } from '../../interfaces/about/about-details.interface';
import { setAboutState } from './about.actions';
import { AboutPayload, IAboutStateModel } from './about.interface';

export const aboutActions = {
  setAboutState,
};

export const ABOUT_STATE_TOKEN = new StateToken<IAboutStateModel>('about');

@State<IAboutStateModel>({
  name: ABOUT_STATE_TOKEN,
  defaults: {
    details: new AboutDetails(),
  },
})
@Injectable()
export class AboutState {
  @Selector()
  public static getState(state: IAboutStateModel) {
    return state;
  }

  @Selector()
  public static getDetails(state: IAboutStateModel) {
    return state.details;
  }

  @Action(setAboutState)
  public setAboutState(ctx: StateContext<IAboutStateModel>, { payload }: AboutPayload) {
    return ctx.patchState(payload);
  }
}
