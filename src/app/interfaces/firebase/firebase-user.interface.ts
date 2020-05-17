export interface IFirebaseUserSubmittedPlaylists {
  [key: number]: boolean;
}

export interface IFirebaseUserRecord {
  created: number;
  soundcloudCode: string;
  soundcloudId: number;
  soundcloudOauthToken: string;
  submittedPlaylists: IFirebaseUserSubmittedPlaylists;
}
