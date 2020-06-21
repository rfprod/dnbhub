/* eslint-disable @typescript-eslint/naming-convention */
export interface IFirebaseUserSubmittedPlaylists {
  [key: number]: boolean;
}

export interface IFirebaseUserRecord {
  key?: string;
  created: number;
  sc_code: string; // TODO: rename this vars in client app and in firebase DB
  sc_id: number;
  sc_oauth_token: string;
  submittedPlaylists: IFirebaseUserSubmittedPlaylists;
}

export const defaultFirebaseUserRecord = {
  key: '',
  created: 0,
  sc_code: '',
  sc_id: 0,
  sc_oauth_token: '',
  submittedPlaylists: {},
};

export interface IFirebaseUserRecords {
  [key: string]: IFirebaseUserRecord;
}
