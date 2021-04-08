import { getActionCreator } from 'src/app/utils/ngxs.util';

import {
  TDnbhubUserPayload,
  TGetUserPayload,
  TUpdateFirebaseProfilePayload,
  USER_STATE_TOKEN,
} from './user.interface';

const createAction = getActionCreator(USER_STATE_TOKEN.toString());

const setDnbhubUserState = createAction<TDnbhubUserPayload>('set state');

const getUserRecord = createAction<TGetUserPayload>('get user record');

const updateFirebaseProfile = createAction<TUpdateFirebaseProfilePayload>('update profile');

export const userActions = {
  setDnbhubUserState,
  getUserRecord,
  updateFirebaseProfile,
};
