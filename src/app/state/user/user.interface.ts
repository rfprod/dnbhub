import { IFirebaseUserRecord } from 'src/app/interfaces/firebase';
import { IActionPayload } from 'src/app/utils/ngxs.util';

export interface IDnbhubUserStateModel {
  firebaseId?: string;
  firebaseUser?: IFirebaseUserRecord | null;
}

export type TDnbhubUserPayload = IActionPayload<Partial<IDnbhubUserStateModel>>;

export type TGetUserPayload = IActionPayload<{ id: string }>;
