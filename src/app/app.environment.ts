import {
  ISoundcloudENVInterface,
  IFirebaseENVInterface,
  IGoogleApiENVInterface
} from 'src/app/interfaces/index';

/**
 * Application environment as a constant.
 */
export const ENV = {
  soundcloud: {
    clientId: 'SOUNDCLOUD_CLIENT_ID'
  },
  firebase: {
    apiKey: 'FIREBASE_API_KEY',
    authDomain: 'FIREBASE_AUTH_DOMAIN',
    databaseURL: 'FIREBASE_DATABASE_URL',
    projectId: 'FIREBASE_PROJECT_ID',
    storageBucket: 'FIREBASE_STORAGE_BUCKET',
    messagingSenderId: 'FIREBASE_MESSAGING_SENDER_ID',
    privilegedAccessUID: 'PRIVILEGED_ACCESS_FIREBASE_UID'
  },
  gapi: {
    browserKey: 'GOOGLE_APIS_BROWSER_KEY',
    channelId: 'UC2HOUBVyZw9mPM3joMShYKQ',
    part: 'snippet,contentDetails,statistics,topicDetails,status,brandingSettings,invideoPromotion,contentOwnerDetails',
    order: 'date',
    maxResults: '50'
  }
};

/**
 * Application environment.
 */
export class AppEnvironmentConfig {
  public soundcloud: ISoundcloudENVInterface = {
    clientId: 'SOUNDCLOUD_CLIENT_ID'
  };
  public firebase: IFirebaseENVInterface = {
    apiKey: 'FIREBASE_API_KEY',
    authDomain: 'FIREBASE_AUTH_DOMAIN',
    databaseURL: 'FIREBASE_DATABASE_URL',
    projectId: 'FIREBASE_PROJECT_ID',
    storageBucket: 'FIREBASE_STORAGE_BUCKET',
    messagingSenderId: 'FIREBASE_MESSAGING_SENDER_ID',
    privilegedAccessUID: 'PRIVILEGED_ACCESS_FIREBASE_UID'
  };
  public gapi: IGoogleApiENVInterface = {
    browserKey: 'GOOGLE_APIS_BROWSER_KEY',
    channelId: 'UC2HOUBVyZw9mPM3joMShYKQ',
    part: 'snippet,contentDetails,statistics,topicDetails,status,brandingSettings,invideoPromotion,contentOwnerDetails',
    order: 'date',
    maxResults: '50'
  };
};
