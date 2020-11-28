import { getActionCreator } from 'src/app/utils/ngxs.util';

import { TDnbhubUserPayload, TGetUserPayload } from './user.interface';

const createAction = getActionCreator('User');

export const setDnbhubUserState = createAction<TDnbhubUserPayload>('set state');

export const getUserRecord = createAction<TGetUserPayload>('get user record');
