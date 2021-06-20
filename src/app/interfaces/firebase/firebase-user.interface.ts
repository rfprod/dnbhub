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

export const newFirebaseUserRecord: IFirebaseUserRecord = {
  sc_code: '',
  sc_oauth_token: '',
  sc_id: 0,
  submittedPlaylists: {},
  created: new Date().getTime(),
};

export const setDBuserNewValuesOptions = (
  id: number | undefined,
  code: string,
  oauthToken: string,
) => ({
  sc_id: id,
  sc_code: code,
  sc_oauth_token: oauthToken,
});
