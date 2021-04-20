import { getActionCreator } from 'src/app/utils/ngxs.util';

import {
  FIREBASE_STATE_TOKEN,
  TDnbhubFirebasePayload,
  TEmailSignInPayload,
  TResetPasswordPayload,
} from './firebase.interface';

const createAction = getActionCreator(FIREBASE_STATE_TOKEN.toString());

const setState = createAction<TDnbhubFirebasePayload>('set state');

const sendPasswordResetEmail = createAction<TResetPasswordPayload>('send password reset email');

const emailSignIn = createAction<TEmailSignInPayload>('email sign in');

const signOut = createAction('sign out');

export const firebaseActions = {
  setState,
  sendPasswordResetEmail,
  emailSignIn,
  signOut,
};
