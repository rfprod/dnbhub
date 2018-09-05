export interface IFirebaseENVInterface {
	apiKey: string;
	authDomain: string;
	databaseURL: string;
	projectId: string;
	storageBucket: string;
	messagingSenderId: string;
}

export interface IGoogleApiENVInterface {
	browserKey: string;
	channelId: string;
	part: string;
	order: string;
	maxResults: string;
}

export interface IEnvironmentInterface {
	firebase: IFirebaseENVInterface;
	gapi: IGoogleApiENVInterface;
}

/**
 * Application environment.
 */
export const ENV: IEnvironmentInterface = {
	firebase: {
		apiKey: 'firebase_api_key',
		authDomain: 'firebase_auth_domain',
		databaseURL: 'firebase_database_url',
		projectId: 'firebase_project_id',
		storageBucket: 'firebase_storage_bucket',
		messagingSenderId: 'firebase_messaging_sender_id'
	},
	gapi: {
		browserKey: 'google_apis_browser_key',
		channelId: 'UC2HOUBVyZw9mPM3joMShYKQ',
		part: 'snippet,contentDetails,statistics,topicDetails,status,brandingSettings,invideoPromotion,contentOwnerDetails',
		order: 'date',
		maxResults: '50'
	}
};
