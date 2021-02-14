import { getActionCreator } from 'src/app/utils/ngxs.util';

import { TDnbhubToasterPayload, TOASTER_STATE_TOKEN } from './toaster.interface';

const createAction = getActionCreator(TOASTER_STATE_TOKEN.toString());

export const showToaster = createAction<TDnbhubToasterPayload>('show');
export const hideToaster = createAction('hide');
