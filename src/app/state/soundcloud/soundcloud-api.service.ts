/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Store } from '@ngxs/store';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DnbhubEnvironmentConfig } from 'src/app/app.environment';
import {
  ISoundcloudEnvInterface,
  ScInitOptions,
  SoundcloudMe,
  SoundcloudPlaylist,
  SoundcloudTrack,
  SoundcloudTracksLinkedPartitioning,
} from 'src/app/interfaces/index';
import { DnbhubHttpHandlersService } from 'src/app/services/http-handlers/http-handlers.service';
import { APP_ENV } from 'src/app/utils/injection-tokens';

import { ISoundcloudPlayer } from '../../interfaces/soundcloud/soundcloud-player.interface';
import { soundcloudActions } from './soundcloud.store';

/**
 * TODO: Sounscloud api interface
 */
declare let SC: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(path: string, options?: Record<string, any>): Promise<any>;
  initialize(options: ScInitOptions): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  connect(): Promise<any>;
  stream(trackUrl: string): Promise<any>;
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
  private readonly options: ScInitOptions = new ScInitOptions(
    this.config.clientId,
    'http://dnbhub.com/callback.html',
  );

  private tracksLinkedPartNextHref: string | null = null;

  /**
   * Soundcloud initialization.
   */
  private init(): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return SC.initialize(this.options);
  }

  /**
   * Returns original Soundcloud js api.
   */
  public get SC() {
    return SC;
  }

  /**
   * Returns link with id.
   */
  public getLinkWithId(href: string): string {
    return `${href}?client_id=${this.options.client_id}`;
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
    data: SoundcloudTracksLinkedPartitioning,
  ): SoundcloudTracksLinkedPartitioning {
    const collection = data.collection.map((track: SoundcloudTrack) => {
      track.description = this.processDescription(track.description);
      return track;
    });
    this.tracksLinkedPartNextHref = data.next_href;
    const processedLinkedPartitioning = new SoundcloudTracksLinkedPartitioning(
      collection,
      data.next_href,
    );
    return processedLinkedPartitioning;
  }

  public connect(): Promise<unknown> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return SC.connect();
  }

  /**
   * Gets user details from Sourndcloud.
   * @param userScId User Soundcloud id
   */
  public getMe(userScId?: number): Observable<SoundcloudMe> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const promise: Promise<SoundcloudMe> = SC.get(
      Boolean(userScId) ? `users/${userScId}` : 'me',
    ).then((me: SoundcloudMe) => {
      // console.warn('SC.me.then, me', me);
      if (Boolean(me.description)) {
        me.description = this.processDescription(me.description);
      }
      return me;
    });
    const observable = from(promise);
    return this.handlers.pipeHttpRequest<SoundcloudMe>(observable);
  }

  /**
   * Gets user details from Sourndcloud.
   * @param userScId User Soundcloud id
   */
  public getMyPlaylists(userScId: number): Observable<SoundcloudPlaylist[]> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const promise: Promise<SoundcloudPlaylist[]> = SC.get(`users/${userScId}/playlists`).then(
      (playlists: SoundcloudPlaylist[]) => {
        return playlists;
      },
    );
    const observable = from(promise);
    return this.handlers.pipeHttpRequest<SoundcloudPlaylist[]>(observable);
  }

  /**
   * Gets user tracks.
   * Performs initial request if data.tracksLinkedPartNextHref is falsy.
   * Calls getTracksNextHref if data.tracksLinkedPartNextHref is truthy.
   * @param userId Soundcloud user id
   */
  public getUserTracks(userId: number): Observable<SoundcloudTracksLinkedPartitioning> {
    let observable = of(new SoundcloudTracksLinkedPartitioning());
    if (!Boolean(this.tracksLinkedPartNextHref)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const promise: Promise<SoundcloudTracksLinkedPartitioning> = SC.get(
        `/users/${userId}/tracks`,
        {
          linked_partitioning: 1,
        },
      )
        .then((data: SoundcloudTracksLinkedPartitioning) => {
          this.tracksLinkedPartNextHref = data.next_href;
          const tracks = this.processTracksCollection(data);
          return tracks;
        })
        .catch(error => error);
      observable = from(promise);
    } else {
      observable = this.getTracksNextHref();
    }
    return this.handlers.pipeHttpRequest<SoundcloudTracksLinkedPartitioning>(observable);
  }

  /**
   * Gets user tracks when initial request was already made, and next_href is present in this.data.tracks.
   */
  public getTracksNextHref(): Observable<SoundcloudTracksLinkedPartitioning> {
    return this.handlers
      .pipeHttpRequest<SoundcloudTracksLinkedPartitioning>(
        this.http.get<SoundcloudTracksLinkedPartitioning>(this.tracksLinkedPartNextHref ?? ''),
      )
      .pipe(map(tracksLinkedPart => this.processTracksCollection(tracksLinkedPart)));
  }

  /**
   * Gets soundcloud playlist.
   * @param playlistId Soundcloud playlist id
   */
  public getPlaylist(playlistId: number): Observable<SoundcloudPlaylist> {
    const observable = from(
      SC.get(`/playlists/${playlistId}`)
        .then((playlist: SoundcloudPlaylist) => {
          playlist.description = this.processDescription(playlist.description);
          playlist.tracks = playlist.tracks.map((track: SoundcloudTrack) => {
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
  public processDescription(raw: string = ''): string {
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
    // TODO type
    // TODO: existing explicit type may be incorrect
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const promise = SC.stream(`/tracks/${trackId}`);
    return from(promise);
  }

  public ngOnDestroy(): void {
    const tracks = new SoundcloudTracksLinkedPartitioning();
    const playlists: SoundcloudPlaylist[] = [];
    void this.store.dispatch(new soundcloudActions.setDnbhubSoundcloudState({ tracks, playlists }));
  }
}
