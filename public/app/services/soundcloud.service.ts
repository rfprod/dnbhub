import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { CustomHttpHandlersService } from './custom-http-handlers.service';
import { CustomDeferredService } from './custom-deferred.service';

import { Observable } from 'rxjs';
import { timeout, take, tap, map, catchError } from 'rxjs/operators';

import { ISoundcloudTracksLinkedPartitioning } from '../interfaces';

declare let SC;

@Injectable()
export class SoundcloudService {

	/**
	 * @param http HttpClient
	 * @param handlers Custom Http Handlers
	 */
	constructor(
		private http: HttpClient,
		private handlers: CustomHttpHandlersService
	) {
		console.log('SoundcloudService constructor');
		this.init();
	}

	/**
	 * Soundcloud client id.
	 */
	private options: { client_id, redirect_uri } = {
		client_id: 'soundcloud_client_id',
		redirect_uri: 'http://dnbhub.com/callback.html' // TODO: replace callback url after API key issue
	};

	/**
	 * Soundcloud initialization.
	 */
	private init(): void {
		return SC.initialize(this.options);
	}

	/**
	 * Returns link with id.
	 */
	public getLinkWithId(href: string): string {
		const id = this.options.client_id;
		return `${href}?client_id=${id}`;
	}

	/**
	 * Shared Soundcloud data.
	 */
	public data: { tracks: ISoundcloudTracksLinkedPartitioning, playlist: any[] } = {
		tracks: {
			collection: [],
			next_href: ''
		},
		playlist: []
	};

	/**
	 * Indicates that there's no more tracks to load.
	 */
	private noMoreTracks: boolean = false;

	/**
	 * Resets Soundcloud service stored data.
	 * May be useful later, for now is not used.
	 */
	public resetServiceData(): void {
		this.data = {
			tracks: {
				collection: [],
				next_href: ''
			},
			playlist: []
		};
		this.noMoreTracks = false;
	}

	/**
	 * Processes received tracks collection. Saves data to local shared model.
	 * Returns full processed collection.
	 */
	private processTracksCollection(data: ISoundcloudTracksLinkedPartitioning): any[] {
		const processedTracks = data.collection.map((track: any) => {
			track.description = this.processDescription(track.description);
			return track;
		});
		// console.log('processedTracks', processedTracks);
		// console.log('this.data.tracks.collection', this.data.tracks.collection);
		const previousCollectionLength: number = this.data.tracks.collection.length;
		for (const track of processedTracks) {
			if (!this.data.tracks.collection.filter((item: any) => item.id === track.id).length) {
				this.data.tracks.collection.push(track);
			}
		}
		// console.log('this.data.tracks.collection pushed', this.data.tracks.collection);
		if (previousCollectionLength === this.data.tracks.collection.length) {
			this.noMoreTracks = true;
		}
		this.data.tracks.next_href = data.next_href;
		return processedTracks;
	}

	/**
	 * Gets user tracks.
	 * Performs initial request if data.tracks.next_href is falsy.
	 * Calls getTracksNextHref if data.tracks.next_href is truthy.
	 * @param userId Soundcloud user id
	 */
	public getUserTracks(userId: string): Promise<any> {
		const def: CustomDeferredService<any> = new CustomDeferredService<any>();
		if (this.noMoreTracks) {
			// don't waste bandwidth, there's no more tracks
			console.log('Soundcloud service: no more tracks');
			def.resolve([]);
		} else if (!this.data.tracks.next_href) {
			SC.get(`/users/${userId}/tracks`, { linked_partitioning: 1 })
				.then((data: ISoundcloudTracksLinkedPartitioning) => {
					console.log('getUserTracks, data', data);
					const processedTracks = this.processTracksCollection(data);
					def.resolve(processedTracks);
				})
				.catch((error: any) => def.reject(error));
		} else {
			this.getTracksNextHref().then(() => def.resolve(this.data.tracks.collection));
		}
		return def.promise;
	}

	/**
	 * Gets user tracks when initial request was already made, and next_href is present in this.data.tracks.
	 */
	public getTracksNextHref(): Promise<any> {
		return this.http.get(this.data.tracks.next_href).pipe(
				timeout(10000),
				take(1),
				map((data: any) => this.processTracksCollection(data)),
				catchError(this.handlers.handleError)
			).toPromise();
	}

	/**
	 * Gets soundcloud playlist.
	 * @param playlistId Soundcloud playlist id
	 */
	public getPlaylist(playlistId: string): Promise<any> {
		const def: CustomDeferredService<any> = new CustomDeferredService<any>();
		SC.get(`/playlists/${playlistId}`)
			.then((playlist: any) => {
				playlist.description = this.processDescription(playlist.description);
				playlist.tracks = playlist.tracks.map((track: any) => {
					track.description = this.processDescription(track.description);
					return track;
				});
				def.resolve(playlist);
			})
			.catch((error: any) => def.reject(error));
		return def.promise;
	}

	/**
	 * Provesses soundcloud playlist description.
	 * Converts:
	 * - \n to <br/>
	 * - links to anchors
	 */
	private processDescription(unprocessed: string): string {
		if (!unprocessed) { return unprocessed; }
		const processed = unprocessed
			// parse line breaks
			.replace(/\n/g, '<br/>')
			// parse all urls, full and partial
			.replace(/((http(s)?)?(:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9@:%._+~#=]{0,255}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*))/g, '<a href="$1" target=_blank><i class="fa fa-external-link"></i> <span class="md-caption">$1</span></a>')
			// add to partial hrefs protocol prefix
			.replace(/href="((www\.)?[a-zA-Z0-9][-a-zA-Z0-9@:%._+~#=]{0,255}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*))"/g, 'href="http://$1"')
			// parse soundcloud account mentions
			.replace(/(@)([^@,\s<)\]]+)/g, '<a href="https://soundcloud.com/$2" target=_blank><i class="fa fa-external-link"></i> <span class="md-caption">$1$2</span></a>');
		// console.log('processed', processed);
		return processed;
	}

	/**
	 * Returns resolved soundcloud track stream object.
	 * @param trackId Soundcloud track id
	 */
	public streamTrack(trackId: string): Promise<any> {
		const def: CustomDeferredService<any> = new CustomDeferredService<any>();
		SC.stream(`/tracks/${trackId}`)
			.then((player: any) => {
				def.resolve(player);
			})
			.catch((error: any) => def.reject(error));
		return def.promise;
	}

}
