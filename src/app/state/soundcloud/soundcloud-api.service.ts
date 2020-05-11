/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/camelcase */
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Store } from '@ngxs/store';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppEnvironmentConfig } from 'src/app/app.environment';
import {
  ISoundcloudENVInterface,
  ScInitOptions,
  SoundcloudMe,
  SoundcloudPlaylist,
  SoundcloudTrack,
  SoundcloudTracksLinkedPartitioning,
} from 'src/app/interfaces/index';
import { HttpHandlersService } from 'src/app/services/http-handlers/http-handlers.service';
import { APP_ENV } from 'src/app/utils/injection-tokens';

import { soundcloudActions } from './soundcloud.store';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let SC: any;

/**
 * Soundcloud service.
 * Controls Soundcloud JavaScript SDK.
 */
@Injectable()
export class SoundcloudApiService implements OnDestroy {
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
    private readonly handlers: HttpHandlersService,
    public sanitizer: DomSanitizer,
    private readonly store: Store,
    @Inject(APP_ENV) private readonly env: AppEnvironmentConfig,
  ) {
    this.init();
  }

  /**
   * Application environment: Firebase API.
   */
  private readonly config: ISoundcloudENVInterface = this.env.soundcloud;

  /**
   * Soundcloud client id.
   */
  private readonly options: ScInitOptions = new ScInitOptions(
    this.config.clientId,
    'http://dnbhub.com/callback.html',
  );

  /**
   * Shared Soundcloud data.
   */
  public readonly data: {
    user: {
      me: SoundcloudMe;
      playlists: SoundcloudPlaylist[];
    };
    tracksLinkedPartNextHref: string;
  } = {
    user: {
      me: new SoundcloudMe(),
      playlists: [],
    },
    tracksLinkedPartNextHref: null,
  };

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
    this.data.user.me = new SoundcloudMe(); // TODO: this should be removed
    this.data.user.playlists = []; // TODO: this should be removed
    this.data.tracksLinkedPartNextHref = null;
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
    this.data.tracksLinkedPartNextHref = data.next_href;
    const processedLinkedPartitioning = new SoundcloudTracksLinkedPartitioning(
      collection,
      data.next_href,
    );
    return processedLinkedPartitioning;
  }

  /**
   * Gets user details from Sourndcloud.
   * @param userScId User Soundcloud id
   */
  public getMe(userScId: string): Promise<{ me: SoundcloudMe; playlists: SoundcloudPlaylist[] }> {
    console.warn('getMe, use has got a token');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return SC.get('users/' + userScId)
      .then((me: SoundcloudMe) => {
        console.warn('SC.me.then, me', me);
        if (Boolean(me.description)) {
          me.description = this.processDescription(me.description);
        }
        this.data.user.me = me;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return SC.get(`users/${me.id}playlists`);
      })
      .then((playlists: SoundcloudPlaylist[]) => {
        console.warn('SC.playlists.then, playlists', playlists);
        this.data.user.playlists = playlists;
        const user = this.data.user;
        return user;
      });
  }

  /**
   * Gets user tracks.
   * Performs initial request if data.tracksLinkedPartNextHref is falsy.
   * Calls getTracksNextHref if data.tracksLinkedPartNextHref is truthy.
   * @param userId Soundcloud user id
   */
  public getUserTracks(userId: string | number): Observable<SoundcloudTracksLinkedPartitioning> {
    let observable = of(new SoundcloudTracksLinkedPartitioning());
    if (!Boolean(this.data.tracksLinkedPartNextHref)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const promise: Promise<SoundcloudTracksLinkedPartitioning> = SC.get(
        `/users/${userId}/tracks`,
        {
          linked_partitioning: 1,
        },
      )
        .then((data: SoundcloudTracksLinkedPartitioning) => {
          console.warn('getUserTracks, data', data);
          this.data.tracksLinkedPartNextHref = data.next_href;
          const tracks = this.processTracksCollection(data);
          return tracks;
        })
        .catch(error => error);
      observable = from(promise);
    } else {
      observable = this.getTracksNextHref();
    }
    return this.handlers.pipeHttpRequest(observable);
  }

  /**
   * Gets user tracks when initial request was already made, and next_href is present in this.data.tracks.
   */
  public getTracksNextHref(): Observable<SoundcloudTracksLinkedPartitioning> {
    return this.handlers
      .pipeHttpRequest<SoundcloudTracksLinkedPartitioning>(
        this.http.get<SoundcloudTracksLinkedPartitioning>(this.data.tracksLinkedPartNextHref),
      )
      .pipe(map(tracksLinkedPart => this.processTracksCollection(tracksLinkedPart)));
  }

  /**
   * Gets soundcloud playlist.
   * @param playlistId Soundcloud playlist id
   */
  public getPlaylist(playlistId: string | number): Observable<SoundcloudPlaylist> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const promise: Promise<SoundcloudPlaylist> = SC.get(`/playlists/${playlistId}`)
      .then((playlist: SoundcloudPlaylist) => {
        playlist.description = this.processDescription(playlist.description);
        playlist.tracks = playlist.tracks.map((track: SoundcloudTrack) => {
          track.description = this.processDescription(track.description);
          return track;
        });
        return playlist;
      })
      .catch(error => error);
    const observable = from(promise);
    return this.handlers.pipeHttpRequest(observable);
  }

  /**
   * Processes soundcloud playlist description.
   * Converts:
   * - \n to <br/>
   * - links to anchors
   * @param raw unprovessed blog post description
   */
  public processDescription(raw: string): string {
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
  public streamTrack(trackId: string | number): Observable<unknown> {
    // TODO type
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const promise = SC.stream(`/tracks/${trackId}`);
    return from(promise);
  }

  public ngOnDestroy(): void {
    const tracks = new SoundcloudTracksLinkedPartitioning();
    const playlist = new SoundcloudPlaylist();
    this.store.dispatch(new soundcloudActions.setSoundcloudState({ tracks, playlist }));
  }
}
