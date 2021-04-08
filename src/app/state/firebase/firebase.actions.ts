import { getActionCreator } from 'src/app/utils/ngxs.util';

import {
  FIREBASE_STATE_TOKEN,
  TDnbhubFirebasePayload,
  TResetPasswordPayload,
} from './firebase.interface';

const createAction = getActionCreator(FIREBASE_STATE_TOKEN.toString());

const setState = createAction<TDnbhubFirebasePayload>('set state');

const sendPasswordResetEmail = createAction<TResetPasswordPayload>('send password reset email');

export const firebaseActions = {
  setState,
  sendPasswordResetEmail,
};
