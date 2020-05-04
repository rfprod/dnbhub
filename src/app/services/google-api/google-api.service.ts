import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, take, timeout } from 'rxjs/operators';
import { AppEnvironmentConfig } from 'src/app/app.environment';
import { IGoogleApiENVInterface } from 'src/app/interfaces/index';
import { CustomHttpHandlersService } from 'src/app/services/custom-http-handlers/custom-http-handlers.service';

/**
 * Google API service.
 */
@Injectable()
export class GoogleApiService {
  /**
   * @param http Http client
   * @param handlers Custom http handlers service
   */
  constructor(
    private readonly http: HttpClient,
    private readonly handlers: CustomHttpHandlersService,
  ) {
    console.warn('GoogleApiService constructor');
  }

  /**
   * Google API endpoints.
   */
  private readonly endpoints: { youtube: { search: string } } = {
    youtube: {
      search: 'https://www.googleapis.com/youtube/v3/channels',
    },
  };

  /**
   * Application environment: Google API (authentication data).
   */
  private readonly config: IGoogleApiENVInterface = new AppEnvironmentConfig().gapi;

  /**
   * Gets youtube channel data.
   */
  public getChannelData(): Observable<any[]> {
    let query: HttpParams = new HttpParams().set('key', this.config.browserKey);
    query = query.set('id', this.config.channelId);
    query = query.set('part', this.config.part);
    query = query.set('order', this.config.order);
    query = query.set('maxResults', this.config.maxResults);
    return this.http
      .get(this.endpoints.youtube.search, { params: query, responseType: 'json' })
      .pipe(
        timeout(this.handlers.timeoutValue()),
        take(1),
        map(this.handlers.extractObject),
        catchError(this.handlers.handleError),
      );
  }
}
