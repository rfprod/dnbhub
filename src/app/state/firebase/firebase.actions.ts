import { getActionCreator } from 'src/app/utils/ngxs.util';

import { FIREBASE_STATE_TOKEN, TDnbhubFirebasePayload } from './firebase.interface';

const createAction = getActionCreator(FIREBASE_STATE_TOKEN.toString());

const setState = createAction<TDnbhubFirebasePayload>('set state');

export const firebaseActions = {
  setState,
};
