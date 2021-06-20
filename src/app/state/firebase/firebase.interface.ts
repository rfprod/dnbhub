import { StateToken } from '@ngxs/store';
import firebase from 'firebase';

import { DnbhubEnvironmentConfig } from '../../app.environment';
import { IFirebaseEnvInterface } from '../../interfaces';
import { IFirebaseUserRecord } from '../../interfaces/firebase/firebase-user.interface';
import { IActionPayload } from '../../utils/ngxs.util';

export type TExtendedUserInfo = firebase.UserInfo & { emailVerified: boolean };

export interface IDnbhubFirebaseStateModel {
  config: IFirebaseEnvInterface;
  userRecord?: IFirebaseUserRecord | null;
  userInfo: TExtendedUserInfo | null;
}

export const firebaseInitialState: IDnbhubFirebaseStateModel = {
  config: new DnbhubEnvironmentConfig().firebase,
  userRecord: null,
  userInfo: null,
};

export type TDnbhubFirebasePayload = IActionPayload<Partial<IDnbhubFirebaseStateModel>>;

export type TResetPasswordPayload = IActionPayload<{ email: string }>;

export type TEmailSignInPayload = IActionPayload<{ email: string; password: string }>;

export type TUpdateFirebaseProfilePayload = IActionPayload<{ displayName: string }>;

export type TSetUserRecordPayload = IActionPayload<{ userRecord: IFirebaseUserRecord | null }>;

export const FIREBASE_STATE_TOKEN = new StateToken<IDnbhubFirebaseStateModel>('firebase');
