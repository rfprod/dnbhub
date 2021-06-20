import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { SUPPORTED_LANGUAGE_KEY } from '../../modules/translate/translations.interface';
import { uiActions } from './ui.actions';
import { IDnbhubUiStateModel, TDnbhubUiPayload, UI_STATE_TOKEN } from './ui.interface';

@State<IDnbhubUiStateModel>({
  name: UI_STATE_TOKEN,
  defaults: {
    darkThemeEnabled: false,
    language: SUPPORTED_LANGUAGE_KEY.ENGLISH,
    sidenavOpened: false,
  },
})
@Injectable()
export class DnbhubUiState {
  @Selector()
  public static getState(state: IDnbhubUiStateModel) {
    return state;
  }

  @Selector()
  public static getDarkThemeEnabled(state: IDnbhubUiStateModel) {
    return state.darkThemeEnabled;
  }

  @Selector()
  public static getLanguage(state: IDnbhubUiStateModel) {
    return state.language;
  }

  @Selector()
  public static getSidenavOpened(state: IDnbhubUiStateModel) {
    return state.sidenavOpened;
  }

  @Action(uiActions.setDnbhubUiState)
  public setDnbhubUiState(ctx: StateContext<IDnbhubUiStateModel>, { payload }: TDnbhubUiPayload) {
    return ctx.patchState(payload);
  }
}
