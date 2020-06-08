export interface IFirebaseUserSubmittedPlaylists {
  [key: number]: boolean;
}

export interface IFirebaseUserRecord {
  key?: string;
  created: number;
  soundcloudCode: string;
  soundcloudId: number;
  soundcloudOauthToken: string;
  submittedPlaylists: IFirebaseUserSubmittedPlaylists;
}

export interface IFirebaseUserRecords {
  [key: string]: IFirebaseUserRecord;
}
