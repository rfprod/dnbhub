import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database';

@Injectable()
export class FirebaseService {

	constructor(
		private fireDB: AngularFireDatabase
	) {}

	public getDB(collection: 'about'|'mastering'|'bandcamp', refOnly: boolean): any {
		return (!refOnly) ? this.fireDB.database.ref('/' + collection).once('value') : this.fireDB.database.ref('/' + collection);
	}
}
