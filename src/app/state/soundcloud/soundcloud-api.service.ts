import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Store } from '@ngxs/store';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { DnbhubEnvironmentConfig } from '../../app.environment';
import { soundcloudPlayerConfigDefaults } from '../../components/soundcloud-player/soundcloud-player.component';
import {
  getTracksOptions,
  ISoundcloudEnvInterface,
  ISoundcloudInitOptions,
  ISoundcloudMe,
  ISoundcloudPlaylist,
  ISoundcloudTrack,
  ISoundcloudTracksLinkedPartitioning,
  linkedPartitioningDefaultValues,
} from '../../interfaces/index';
import { ISoundcloudPlayer } from '../../interfaces/soundcloud/soundcloud-player.interface';
import { DnbhubHttpHandlersService } from '../../services/http-handlers/http-handlers.service';
import { APP_ENV } from '../../utils/injection-tokens';
import { soundcloudActions } from './soundcloud.actions';

/**
 * TODO: Sounscloud api interface
 */
declare let SC: {
  get<T = Record<string, unknown>>(path: string, options?: Record<string, unknown>): Promise<T>;
  initialize(options: ISoundcloudInitOptions): void;
  connect<T = Record<string, unknown>>(): Promise<T>;
  stream<T = unknown>(trackUrl: string): Promise<T>;
};

/**
 * Soundcloud service.
 * Controls Soundcloud JavaScript SDK.
 */
@Injectable({
  providedIn: 'root',
})
export class DnbhubSoundcloudApiService implements OnDestroy {
  /**
   * Widget link conftructor.
   */
  private readonly widgetLinkConstructor: {
    playlistFirst: () => string;
    playlistLast: () => string;
    trackFirst: () => string;
    trackLast: () => string;
  } = {
    playlistFirst: (): string =>
      'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/',
    playlistLast: (): string =>
      '&amp;color=ff5500&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false',
    trackFirst: (): string =>
      'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/',
    trackLast: (): string =>
      '&amp;color=ff5500&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false',
  };

  /**
   * Public widget link getter.
   */
  public readonly widgetLink: {
    playlist: (scPlaylistID: number) => SafeResourceUrl;
    track: (scTrackID: number) => SafeResourceUrl;
  } = {
    playlist: (scPlaylistID: number): SafeResourceUrl =>
      this.sanitizer.bypassSecurityTrustResourceUrl(
        `${this.widgetLinkConstructor.playlistFirst()}${scPlaylistID}${this.widgetLinkConstructor.playlistLast()}`,
      ),
    track: (scTrackID: number): SafeResourceUrl =>
      this.sanitizer.bypassSecurityTrustResourceUrl(
        `${this.widgetLinkConstructor.trackFirst()}${scTrackID}${this.widgetLinkConstructor.trackLast()}`,
      ),
  };

  constructor(
    private readonly http: HttpClient,
    private readonly handlers: DnbhubHttpHandlersService,
    public sanitizer: DomSanitizer,
    private readonly store: Store,
    @Inject(APP_ENV) private readonly env: DnbhubEnvironmentConfig,
  ) {
    this.init();
  }

  /**
   * Application environment: Firebase API.
   */
  private readonly config: ISoundcloudEnvInterface = this.env.soundcloud;

  /**
   * Soundcloud client id.
   */
  private readonly options: ISoundcloudInitOptions = {
    client_id: this.config.clientId,
    redirect_uri: 'http://dnbhub.com/callback.html',
  };

  private tracksLinkedPartNextHref: string | null = null;

  /**
   * Soundcloud initialization.
   */
  private init(): void {
    return SC.initialize(this.options);
  }

  /**
   * Returns original Soundcloud js api.
   */
  public get sc() {
    return SC;
  }

  /**
   * Returns link with id.
   */
  public getLinkWithId(href: string, addLastPatam = false): string {
    return addLastPatam
      ? `${href}&client_id=${this.options.client_id}`
      : `${href}?client_id=${this.options.client_id}`;
  }

  /**
   * Resets Soundcloud service stored data.
   * May be useful later, for now is not used.
   */
  public resetServiceData(): void {
    this.tracksLinkedPartNextHref = null;
  }

  /**
   * Processes received tracks collection. Saves data to local shared model.
   * Returns full processed collection.
   */
  private processTracksCollection(
    data: ISoundcloudTracksLinkedPartitioning,
  ): ISoundcloudTracksLinkedPartitioning {
    const collection = data.collection.map((track: ISoundcloudTrack) => {
      track.description = this.processDescription(track.description);
      return track;
    });
    this.tracksLinkedPartNextHref =
      data.next_href !== null ? this.getLinkWithId(data.next_href, true) : data.next_href;
    const processedLinkedPartitioning: ISoundcloudTracksLinkedPartitioning = {
      collection,
      next_href:
        data.next_href !== null ? this.getLinkWithId(data.next_href, true) : data.next_href,
    };
    return processedLinkedPartitioning;
  }

  public connect(): Promise<unknown> {
    return SC.connect();
  }

  /**
   * Gets user details from Sourndcloud.
   * @param userScId User Soundcloud id
   */
  public getMe(userScId?: number): Observable<ISoundcloudMe> {
    const promise: Promise<ISoundcloudMe> = SC.get(
      Boolean(userScId) ? `users/${userScId}` : 'me',
    ).then((me: ISoundcloudMe) => {
      // console.warn('SC.me.then, me', me);
      if (Boolean(me.description)) {
        me.description = this.processDescription(me.description);
      }
      return me;
    });
    const observable = from(promise);
    return this.handlers.pipeHttpRequest<ISoundcloudMe>(observable);
  }

  /**
   * Gets user details from Sourndcloud.
   * @param userScId User Soundcloud id
   */
  public getMyPlaylists(userScId: number): Observable<ISoundcloudPlaylist[]> {
    const promise: Promise<ISoundcloudPlaylist[]> = SC.get<ISoundcloudPlaylist[]>(
      `users/${userScId}/playlists`,
    ).then(playlists => playlists);
    const observable = from(promise);
    return this.handlers.pipeHttpRequest<ISoundcloudPlaylist[]>(observable);
  }

  /**
   * Gets user tracks.
   * Performs initial request if data.tracksLinkedPartNextHref is falsy.
   * Calls getTracksNextHref if data.tracksLinkedPartNextHref is truthy.
   * @param userId Soundcloud user id
   */
  public getUserTracks(userId: number): Observable<ISoundcloudTracksLinkedPartitioning> {
    let observable = of({ ...linkedPartitioningDefaultValues });
    if (!Boolean(this.tracksLinkedPartNextHref)) {
      const promise: Promise<ISoundcloudTracksLinkedPartitioning> =
        SC.get<ISoundcloudTracksLinkedPartitioning>(`/users/${userId}/tracks`, getTracksOptions)
          .then(data => {
            this.tracksLinkedPartNextHref = data.next_href;
            const tracks = this.processTracksCollection(data);
            return tracks;
          })
          .catch(error => error);
      observable = from(promise);
    } else {
      observable = this.getTracksNextHref();
    }
    return this.handlers.pipeHttpRequest<ISoundcloudTracksLinkedPartitioning>(observable);
  }

  /**
   * Gets user tracks.
   * Performs initial request if data.tracksLinkedPartNextHref is falsy.
   * Calls getTracksNextHref if data.tracksLinkedPartNextHref is truthy.
   * @param userId Soundcloud user id
   */
  public getSpotlight(
    userId = soundcloudPlayerConfigDefaults.user.dnbhub,
  ): Observable<ISoundcloudTracksLinkedPartitioning> {
    let observable = of({ ...linkedPartitioningDefaultValues });
    if (!Boolean(this.tracksLinkedPartNextHref)) {
      const promise: Promise<ISoundcloudTracksLinkedPartitioning> =
        SC.get<ISoundcloudTracksLinkedPartitioning>(
          `/users/${userId}/likes/tracks`,
          getTracksOptions,
        )
          .then(data => {
            this.tracksLinkedPartNextHref = data.next_href;
            const tracks = this.processTracksCollection(data);
            return tracks;
          })
          .catch(error => error);
      observable = from(promise);
    } else {
      observable = this.getTracksNextHref();
    }
    return this.handlers.pipeHttpRequest<ISoundcloudTracksLinkedPartitioning>(observable);
  }

  /**
   * Gets user tracks when initial request was already made, and next_href is present in this.data.tracks.
   */
  public getTracksNextHref(): Observable<ISoundcloudTracksLinkedPartitioning> {
    return this.handlers
      .pipeHttpRequest<ISoundcloudTracksLinkedPartitioning>(
        this.http.get<ISoundcloudTracksLinkedPartitioning>(this.tracksLinkedPartNextHref ?? ''),
      )
      .pipe(map(tracksLinkedPart => this.processTracksCollection(tracksLinkedPart)));
  }

  /**
   * Gets soundcloud playlist.
   * @param playlistId Soundcloud playlist id
   */
  public getPlaylist(playlistId: number): Observable<ISoundcloudPlaylist> {
    const observable = from(
      SC.get<ISoundcloudPlaylist>(`/playlists/${playlistId}`)
        .then(playlist => {
          playlist.description = this.processDescription(playlist.description);
          playlist.tracks = playlist.tracks.map((track: ISoundcloudTrack) => {
            track.description = this.processDescription(track.description);
            return track;
          });
          return playlist;
        })
        .catch(error => error),
    );
    return this.handlers.pipeHttpRequest(observable);
  }

  /**
   * Processes soundcloud playlist description.
   * Converts:
   * - \n to <br/>
   * - links to anchors
   * @param raw unprovessed blog post description
   */
  public processDescription(raw = ''): string {
    if (!Boolean(raw)) {
      return raw;
    }
    const processed = raw
      // parse line breaks
      .replace(/\n/g, '<br/>')
      // parse all urls, full and partial
      .replace(
        /((http(s)?)?(:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9@:%._+~#=]{0,255}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*))/g,
        '<a href="$1" target=_blank><i class="fa fa-external-link"></i> <span class="md-caption">$1</span></a>',
      )
      // add to partial hrefs protocol prefix
      .replace(
        /href="((www\.)?[a-zA-Z0-9][-a-zA-Z0-9@:%._+~#=]{0,255}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*))"/g,
        'href="http://$1"',
      )
      // parse soundcloud account mentions
      .replace(
        /(@)([^@,\s<)\]]+)/g,
        '<a href="https://soundcloud.com/$2" target=_blank><i class="fa fa-external-link"></i> <span class="md-caption">$1$2</span></a>',
      );
    // console.warn('processed', processed);
    return processed;
  }

  /**
   * Returns resolved soundcloud track stream object.
   * @param trackId Soundcloud track id
   */
  public streamTrack(trackId: number): Observable<ISoundcloudPlayer> {
    /**
     * @note TODO: type, existing explicit type may be incorrect
     */
    const promise = SC.stream<ISoundcloudPlayer>(`/tracks/${trackId}`);
    return from(promise);
  }

  public ngOnDestroy(): void {
    const tracks = { ...linkedPartitioningDefaultValues };
    const playlists: ISoundcloudPlaylist[] = [];
    void this.store.dispatch(new soundcloudActions.setDnbhubSoundcloudState({ tracks, playlists }));
  }
}
