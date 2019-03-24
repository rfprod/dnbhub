export interface ISoundcloudENVInterface {
  clientId: string;
}

export interface IFirebaseENVInterface {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  privilegedAccessUID: string;
}

export interface IGoogleApiENVInterface {
  browserKey: string;
  channelId: string;
  part: string;
  order: string;
  maxResults: string;
}

export interface IEnvironmentInterface {
  soundcloud: ISoundcloudENVInterface;
  firebase: IFirebaseENVInterface;
  gapi: IGoogleApiENVInterface;
}
