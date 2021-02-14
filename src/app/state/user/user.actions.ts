import { getActionCreator } from 'src/app/utils/ngxs.util';

import {
  TDnbhubUserPayload,
  TGetUserPayload,
  TUpdateFirebaseProfilePayload,
  USER_STATE_TOKEN,
} from './user.interface';

const createAction = getActionCreator(USER_STATE_TOKEN.toString());

export const setDnbhubUserState = createAction<TDnbhubUserPayload>('set state');

export const getUserRecord = createAction<TGetUserPayload>('get user record');

export const updateFirebaseProfile = createAction<TUpdateFirebaseProfilePayload>('update profile');
