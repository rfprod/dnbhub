import { StateToken } from '@ngxs/store';
import { IFirebaseUserRecord } from 'src/app/interfaces/firebase';
import { IActionPayload } from 'src/app/utils/ngxs.util';

export interface IDnbhubUserStateModel {
  firebaseId?: string;
  firebaseUser?: IFirebaseUserRecord | null;
}

export type TDnbhubUserPayload = IActionPayload<Partial<IDnbhubUserStateModel>>;

export type TGetUserPayload = IActionPayload<{ id: string }>;

export type TUpdateFirebaseProfilePayload = IActionPayload<{ displayName: string }>;

export const USER_STATE_TOKEN = new StateToken<IDnbhubUserStateModel>('user');
