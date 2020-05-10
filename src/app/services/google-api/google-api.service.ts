import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppEnvironmentConfig } from 'src/app/app.environment';
import { IGoogleApiENVInterface } from 'src/app/interfaces/index';
import { HttpHandlersService } from 'src/app/services/http-handlers/http-handlers.service';
import { APP_ENV } from 'src/app/utils';

/**
 * Google API service.
 */
@Injectable()
export class GoogleApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly handlers: HttpHandlersService,
    @Inject(APP_ENV) private readonly env: AppEnvironmentConfig,
  ) {}

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
  private readonly config: IGoogleApiENVInterface = this.env.gapi;

  /**
   * Gets youtube channel data.
   * TODO: use this data, it's not used anywhere currently, there's no view for youtube channel playlist.
   */
  public getChannelData() {
    let query: HttpParams = new HttpParams().set('key', this.config.browserKey);
    query = query.set('id', this.config.channelId);
    query = query.set('part', this.config.part);
    query = query.set('order', this.config.order);
    query = query.set('maxResults', this.config.maxResults);
    return this.handlers.pipeHttpRequest(
      this.http.get(this.endpoints.youtube.search, { params: query, responseType: 'json' }),
    );
  }
}
