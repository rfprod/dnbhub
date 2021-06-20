import { getActionCreator } from '../../utils/ngxs.util';
import { TDnbhubUiPayload, UI_STATE_TOKEN } from './ui.interface';

const createAction = getActionCreator(UI_STATE_TOKEN.toString());

const setDnbhubUiState = createAction<TDnbhubUiPayload>('set state');

export const uiActions = {
  setDnbhubUiState,
};
