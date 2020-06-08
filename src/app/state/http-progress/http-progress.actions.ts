import { getActionCreator } from 'src/app/utils/ngxs.util';

import { TDnbhubHttpProgressPayload } from './http-progress.interface';

const createAction = getActionCreator('HttpProgress');

export const startProgress = createAction<TDnbhubHttpProgressPayload>('Start http progress');
export const stopProgress = createAction<TDnbhubHttpProgressPayload>('Stop http progress');
