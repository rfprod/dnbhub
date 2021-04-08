import { getActionCreator } from 'src/app/utils/ngxs.util';

import { HTTP_PROGRESS_STATE_TOKEN, TDnbhubHttpProgressPayload } from './http-progress.interface';

const createAction = getActionCreator(HTTP_PROGRESS_STATE_TOKEN.toString());

const startProgress = createAction<TDnbhubHttpProgressPayload>('Start http progress');
const stopProgress = createAction<TDnbhubHttpProgressPayload>('Stop http progress');

export const httpProgressActions = {
  startProgress,
  stopProgress,
};
