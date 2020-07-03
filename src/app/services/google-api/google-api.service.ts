import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { DnbhubEnvironmentConfig } from '../../app.environment';
import { IGoogleApiEnvInterface } from '../../interfaces/environment/environment.interface';
import { APP_ENV } from '../../utils/injection-tokens';
import { DnbhubHttpHandlersService } from '../http-handlers/http-handlers.service';

/**
 * Google API service.
 */
@Injectable({
  providedIn: 'root',
})
export class DnbhubGoogleApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly handlers: DnbhubHttpHandlersService,
    @Inject(APP_ENV) private readonly env: DnbhubEnvironmentConfig,
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
  private readonly config: IGoogleApiEnvInterface = this.env.gapi;

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
