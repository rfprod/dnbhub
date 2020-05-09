import { getActionCreator } from 'src/app/utils/ngxs.util';

import { UiPayload } from './ui.interface';

const createAction = getActionCreator('UI');

export const setUiState = createAction<UiPayload>('Set UI state');
