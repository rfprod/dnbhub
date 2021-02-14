import { getActionCreator } from 'src/app/utils/ngxs.util';

import { TDnbhubUiPayload, UI_STATE_TOKEN } from './ui.interface';

const createAction = getActionCreator(UI_STATE_TOKEN.toString());

export const setDnbhubUiState = createAction<TDnbhubUiPayload>('set state');
