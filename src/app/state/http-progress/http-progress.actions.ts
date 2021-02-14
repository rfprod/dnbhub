import { getActionCreator } from 'src/app/utils/ngxs.util';

import { HTTP_PROGRESS_STATE_TOKEN, TDnbhubHttpProgressPayload } from './http-progress.interface';

const createAction = getActionCreator(HTTP_PROGRESS_STATE_TOKEN.toString());

export const startProgress = createAction<TDnbhubHttpProgressPayload>('Start http progress');
export const stopProgress = createAction<TDnbhubHttpProgressPayload>('Stop http progress');
