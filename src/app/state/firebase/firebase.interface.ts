import { StateToken } from '@ngxs/store';
import firebase from 'firebase';
import { IFirebaseEnvInterface } from 'src/app/interfaces';

import { DnbhubEnvironmentConfig } from '../../app.environment';
import { IActionPayload } from '../../utils/ngxs.util';

export type TExtendedUserInfo = firebase.UserInfo & { emailVerified: boolean };

export interface IDnbhubFirebaseStateModel {
  config: IFirebaseEnvInterface;
  userInfo: TExtendedUserInfo | null;
}

export const firebaseInitialState: IDnbhubFirebaseStateModel = {
  config: new DnbhubEnvironmentConfig().firebase,
  userInfo: null,
};

export type TDnbhubFirebasePayload = IActionPayload<Partial<IDnbhubFirebaseStateModel>>;

export type TResetPasswordPayload = IActionPayload<{ email: string }>;

export type TEmailSignInPayload = IActionPayload<{ email: string; password: string }>;

export const FIREBASE_STATE_TOKEN = new StateToken<IDnbhubFirebaseStateModel>('firebase');
