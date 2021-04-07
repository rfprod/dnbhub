import { StateToken } from '@ngxs/store';
import firebase from 'firebase';
import { IFirebaseEnvInterface } from 'src/app/interfaces';

import { DnbhubEnvironmentConfig } from '../../app.environment';
import { IActionPayload } from '../../utils/ngxs.util';

export interface IDnbhubFirebaseStateModel {
  config: IFirebaseEnvInterface;
  user: firebase.User | null;
}

export const firebaseInitialState: IDnbhubFirebaseStateModel = {
  config: new DnbhubEnvironmentConfig().firebase,
  user: null,
};

export type TDnbhubFirebasePayload = IActionPayload<Partial<IDnbhubFirebaseStateModel>>;

export const FIREBASE_STATE_TOKEN = new StateToken<IDnbhubFirebaseStateModel>('firebase');
