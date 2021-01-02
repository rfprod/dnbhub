export interface ISoundcloudEnvInterface {
  clientId: string;
}

export interface IFirebaseEnvInterface {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  privilegedAccessUID: string;
  measurementId: string;
}

export interface IGoogleApiEnvInterface {
  browserKey: string;
  channelId: string;
  part: string;
  order: string;
  maxResults: string;
}

export interface IEnvironmentInterface {
  soundcloud: ISoundcloudEnvInterface;
  firebase: IFirebaseEnvInterface;
  gapi: IGoogleApiEnvInterface;
}
