import { writeFile } from 'fs';
import { argv } from 'yargs';

/**
 * Usage:
 * - ts-node src/set-env.ts
 * - ts-node src/set-env.ts --reset=true
 */

/**
 * Environment file path.
 */
const targetPath = './src/app/app.environment.ts';

/**
 * Environment file config.
 */
let envConfigFile = `import {
  IFirebaseEnvInterface,
  IGoogleApiEnvInterface,
  ISoundcloudEnvInterface,
} from './interfaces/index';

/**
 * Application environment as a constant.
 */
export const ENV = {
  soundcloud: {
    clientId: 'SOUNDCLOUD_CLIENT_ID',
  },
  firebase: {
    apiKey: 'FIREBASE_API_KEY',
    authDomain: 'FIREBASE_AUTH_DOMAIN',
    databaseURL: 'FIREBASE_DATABASE_URL',
    projectId: 'FIREBASE_PROJECT_ID',
    storageBucket: 'FIREBASE_STORAGE_BUCKET',
    messagingSenderId: 'FIREBASE_MESSAGING_SENDER_ID',
    privilegedAccessUID: 'PRIVILEGED_ACCESS_FIREBASE_UID',
    measurementId: 'FIREBASE_MEASUREMENT_ID',
  },
  gapi: {
    browserKey: 'GOOGLE_APIS_BROWSER_KEY',
    channelId: 'UC2HOUBVyZw9mPM3joMShYKQ',
    part: 'snippet,contentDetails,statistics,topicDetails,status,brandingSettings,invideoPromotion,contentOwnerDetails',
    order: 'date',
    maxResults: '50',
  },
};

/**
 * Application environment.
 */
export class DnbhubEnvironmentConfig {
  public soundcloud: ISoundcloudEnvInterface = {
    clientId: 'SOUNDCLOUD_CLIENT_ID',
  };
  public firebase: IFirebaseEnvInterface = {
    apiKey: 'FIREBASE_API_KEY',
    authDomain: 'FIREBASE_AUTH_DOMAIN',
    databaseURL: 'FIREBASE_DATABASE_URL',
    projectId: 'FIREBASE_PROJECT_ID',
    storageBucket: 'FIREBASE_STORAGE_BUCKET',
    messagingSenderId: 'FIREBASE_MESSAGING_SENDER_ID',
    privilegedAccessUID: 'PRIVILEGED_ACCESS_FIREBASE_UID',
    measurementId: 'FIREBASE_MEASUREMENT_ID',
  };
  public gapi: IGoogleApiEnvInterface = {
    browserKey: 'GOOGLE_APIS_BROWSER_KEY',
    channelId: 'UC2HOUBVyZw9mPM3joMShYKQ',
    part:
      'snippet,contentDetails,statistics,topicDetails,status,brandingSettings,invideoPromotion,contentOwnerDetails',
    order: 'date',
    maxResults: '50',
  };
}
`;

/**
 * If reset argument is passed (retrieved via yargs argv object) environment
 * variables in client app are set to default values.
 */
const reset = argv.reset;

if (!Boolean(reset)) {
  /**
   * Load environment variables.
   */
  require('dotenv').config();

  /**
   * Environment file config.
   */
  envConfigFile = `import {
  ISoundcloudEnvInterface,
  IFirebaseEnvInterface,
  IGoogleApiEnvInterface
} from './interfaces/index';

/**
 * Application environment as a constant.
 */
export const ENV = {
  soundcloud: {
    clientId: '${process.env.SOUNDCLOUD_CLIENT_ID}'
  },
  firebase: {
    apiKey: '${process.env.FIREBASE_API_KEY}',
    authDomain: '${process.env.FIREBASE_AUTH_DOMAIN}',
    databaseURL: '${process.env.FIREBASE_DATABASE_URL}',
    projectId: '${process.env.FIREBASE_PROJECT_ID}',
    storageBucket: '${process.env.FIREBASE_STORAGE_BUCKET}',
    messagingSenderId: '${process.env.FIREBASE_MESSAGING_SENDER_ID}',
    privilegedAccessUID: '${process.env.PRIVILEGED_ACCESS_FIREBASE_UID}',
    measurementId: '${process.env.FIREBASE_MEASUREMENT_ID}'
  },
  gapi: {
    browserKey: '${process.env.GOOGLE_APIS_BROWSER_KEY}',
    channelId: 'UC2HOUBVyZw9mPM3joMShYKQ',
    part: 'snippet,contentDetails,statistics,topicDetails,status,brandingSettings,invideoPromotion,contentOwnerDetails',
    order: 'date',
    maxResults: '50'
  }
};

/**
 * Application environment.
 */
export class DnbhubEnvironmentConfig {
  public soundcloud: ISoundcloudEnvInterface = {
    clientId: '${process.env.SOUNDCLOUD_CLIENT_ID}'
  };
  public firebase: IFirebaseEnvInterface = {
    apiKey: '${process.env.FIREBASE_API_KEY}',
    authDomain: '${process.env.FIREBASE_AUTH_DOMAIN}',
    databaseURL: '${process.env.FIREBASE_DATABASE_URL}',
    projectId: '${process.env.FIREBASE_PROJECT_ID}',
    storageBucket: '${process.env.FIREBASE_STORAGE_BUCKET}',
    messagingSenderId: '${process.env.FIREBASE_MESSAGING_SENDER_ID}',
    privilegedAccessUID: '${process.env.PRIVILEGED_ACCESS_FIREBASE_UID}',
    measurementId: '${process.env.FIREBASE_MEASUREMENT_ID}'
  };
  public gapi: IGoogleApiEnvInterface = {
    browserKey: '${process.env.GOOGLE_APIS_BROWSER_KEY}',
    channelId: 'UC2HOUBVyZw9mPM3joMShYKQ',
    part: 'snippet,contentDetails,statistics,topicDetails,status,brandingSettings,invideoPromotion,contentOwnerDetails',
    order: 'date',
    maxResults: '50'
  };
};
`;
}

/**
 * Writes environment file.
 */
writeFile(targetPath, envConfigFile, function (err) {
  if (Boolean(err)) {
    console.log(err);
  }

  console.log(`Output generated at ${targetPath}`);
});
