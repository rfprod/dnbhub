import { getActionCreator } from 'src/app/utils/ngxs.util';

import { HttpProgressPayload } from './http-progress.interface';

const createAction = getActionCreator('HttpProgress');

export const startProgress = createAction<HttpProgressPayload>('Start http progress');
export const stopProgress = createAction<HttpProgressPayload>('Stop http progress');
