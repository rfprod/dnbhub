import { Injectable, Inject } from '@angular/core';

declare let firebase;

@Injectable()
export class FirebaseService {

	constructor(
		@Inject('Window') private window: Window
	) {
		console.log('FirebaseService constructor');
		this.init();
	}

	private config: any = {
		apiKey: 'firebase_api_key',
		authDomain: 'firebase_auth_domain',
		databaseURL: 'firebase_database_url',
		projectId: 'firebase_project_id',
		storageBucket: 'firebase_storage_bucket',
		messagingSenderId: 'firebase_messaging_sender_id'
	};

	private db: any;

	private init(): void {
		firebase.initializeApp(this.config);
		this.db = firebase.database();
	}

	public getDB(collection: 'about'|'mastering'|'bandcamp', refOnly: boolean): any {
		return (!refOnly) ? this.db.ref('/' + collection).once('value') : this.db.ref('/' + collection);
	}
}
