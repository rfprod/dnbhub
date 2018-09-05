import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { CustomHttpHandlersService } from './custom-http-handlers.service';

import { ENV, IEnvironmentInterface, IGoogleApiENVInterface } from '../app.environment';

import { Observable } from 'rxjs';
import { timeout, take, map, catchError } from 'rxjs/operators';

@Injectable()
export class GoogleApiService {

	constructor(
		private http: HttpClient,
		private handlers: CustomHttpHandlersService,
		@Inject(ENV) private environment: IEnvironmentInterface
	) {
		console.log('GoogleApiService constructor');
	}

	/**
	 * Google API endpoints.
	 */
	private endpoints: { youtube: { search: string } } = {
		youtube: {
			search: 'https://www.googleapis.com/youtube/v3/channels'
		}
	};

	/**
	 * Google API authentication data.
	 */
	private config: IGoogleApiENVInterface = this.environment.gapi;

	/**
	 * Gets youtube channel data.
	 */
	public getChannelData(): Observable<any[]> {
		let query: HttpParams = new HttpParams().set('key', this.config.browserKey);
		query = query.set('id', this.config.channelId);
		query = query.set('part', this.config.part);
		query = query.set('order', this.config.order);
		query = query.set('maxResults', this.config.maxResults);
		return this.http.get(this.endpoints.youtube.search, { params: query, responseType: 'json' }).pipe(
			timeout(this.handlers.timeoutValue()),
			take(1),
			map(this.handlers.extractObject),
			catchError(this.handlers.handleError)
		);
	}
}
