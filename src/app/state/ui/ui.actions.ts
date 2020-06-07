import { getActionCreator } from 'src/app/utils/ngxs.util';

import { TDnbhubUiPayload } from './ui.interface';

const createAction = getActionCreator('UI');

export const setDnbhubUiState = createAction<TDnbhubUiPayload>('Set UI state');
