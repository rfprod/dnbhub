import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import { SUPPORTED_LANGUAGE_KEY } from 'src/app/modules/translate/translations.interface';

import { setDnbhubUiState } from './ui.actions';
import { IDnbhubUiStateModel, TDnbhubUiPayload } from './ui.interface';

export const uiActions = {
  setDnbhubUiState,
};

export const UI_STATE_TOKEN = new StateToken<IDnbhubUiStateModel>('ui');

@State<IDnbhubUiStateModel>({
  name: UI_STATE_TOKEN,
  defaults: {
    darkThemeEnabled: false,
    language: SUPPORTED_LANGUAGE_KEY.ENGLISH,
    sidenavOpened: false,
  },
})
// eslint-disable-next-line @angular-eslint/use-injectable-provided-in
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

  @Action(setDnbhubUiState)
  public setDnbhubUiState(ctx: StateContext<IDnbhubUiStateModel>, { payload }: TDnbhubUiPayload) {
    return ctx.patchState(payload);
  }
}
