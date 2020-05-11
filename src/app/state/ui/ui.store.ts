import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ESUPPORTED_LANGUAGE_KEY } from 'src/app/modules/translate/translations.interface';

import { setUiState } from './ui.actions';
import { IUiStateModel, UiPayload } from './ui.interface';

export const uiActions = {
  setUiState,
};

@State<IUiStateModel>({
  name: 'ui',
  defaults: {
    darkThemeEnabled: false,
    language: ESUPPORTED_LANGUAGE_KEY.ENGLISH,
    sidenavOpened: false,
  },
})
@Injectable()
export class UiState {
  @Selector()
  public static getState(state: IUiStateModel) {
    return state;
  }

  @Selector()
  public static getDarkThemeEnabled(state: IUiStateModel) {
    return state.darkThemeEnabled;
  }

  @Selector()
  public static getLanguage(state: IUiStateModel) {
    return state.language;
  }

  @Selector()
  public static getSidenavOpened(state: IUiStateModel) {
    return state.sidenavOpened;
  }

  @Action(setUiState)
  public setUiState(ctx: StateContext<IUiStateModel>, { payload }: UiPayload) {
    return ctx.patchState(payload);
  }
}
