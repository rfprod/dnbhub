import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Store } from '@ngxs/store';
import { from, Observable } from 'rxjs';
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
import { CustomDeferredService } from 'src/app/services/custom-deferred/custom-deferred.service';
import { HttpHandlersService } from 'src/app/services/http-handlers/http-handlers.service';

import { APP_ENV } from '../../utils/injection-tokens';
import { soundcloudActions } from './soundcloud.store';

declare let SC: any;

/**
 * Soundcloud service.
 * Controls Soundcloud JavaScript SDK.
 */
@Injectable()
export class SoundcloudHttpService implements OnDestroy {
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
    tracks: SoundcloudTracksLinkedPartitioning;
    playlist: SoundcloudPlaylist;
  } = {
    user: {
      me: new SoundcloudMe(),
      playlists: [],
    },
    tracks: new SoundcloudTracksLinkedPartitioning(),
    playlist: new SoundcloudPlaylist(),
  };

  /**
   * Indicates that there's no more tracks to load.
   */
  private noMoreTracks = false;

  /**
   * Soundcloud initialization.
   */
  private init(): void {
    return SC.initialize(this.options);
  }

  /**
   * Returns original Soundcloud js api.
   */
  public get SC(): any {
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
    this.data.user.me = new SoundcloudMe();
    this.data.user.playlists = [];
    this.data.tracks = new SoundcloudTracksLinkedPartitioning();
    this.data.playlist = new SoundcloudPlaylist();
    this.noMoreTracks = false;
  }

  /**
   * Processes received tracks collection. Saves data to local shared model.
   * Returns full processed collection.
   */
  private processTracksCollection(data: SoundcloudTracksLinkedPartitioning): any[] {
    const processedTracks = data.collection.map((track: any) => {
      track.description = this.processDescription(track.description);
      return track;
    });
    // console.warn('processedTracks', processedTracks);
    // console.warn('this.data.tracks.collection', this.data.tracks.collection);
    const previousCollectionLength: number = this.data.tracks.collection.length;
    for (const track of processedTracks) {
      if (!this.data.tracks.collection.filter((item: any) => item.id === track.id).length) {
        this.data.tracks.collection.push(track);
      }
    }
    // console.warn('this.data.tracks.collection pushed', this.data.tracks.collection);
    if (previousCollectionLength === this.data.tracks.collection.length) {
      this.noMoreTracks = true;
    }
    this.data.tracks.next_href = data.next_href;
    return processedTracks;
  }

  /**
   * Gets user details from Sourndcloud.
   * @param userScId User Soundcloud id
   */
  public getMe(userScId: string): Promise<{ me: any; playlists: SoundcloudPlaylist[] }> {
    console.warn('getMe, use has got a token');
    return SC.get('users/' + userScId)
      .then((me: any) => {
        console.warn('SC.me.then, me', me);
        if (me.description) {
          me.description = this.processDescription(me.description);
        }
        this.data.user.me = me;
        return SC.get('users/' + me.id + '/playlists');
      })
      .then(playlists => {
        console.warn('SC.playlists.then, playlists', playlists);
        this.data.user.playlists = playlists;
        const user = this.data.user;
        return user;
      });
  }

  /**
   * Gets user tracks.
   * Performs initial request if data.tracks.next_href is falsy.
   * Calls getTracksNextHref if data.tracks.next_href is truthy.
   * @param userId Soundcloud user id
   */
  public getUserTracks(userId: string | number): Promise<any> {
    const def: CustomDeferredService<any> = new CustomDeferredService<any>();
    if (this.noMoreTracks) {
      // don't waste bandwidth, there's no more tracks
      console.warn('Soundcloud service: no more tracks');
      def.resolve([]);
    } else if (!this.data.tracks.next_href) {
      SC.get(`/users/${userId}/tracks`, { linked_partitioning: 1 })
        .then((data: SoundcloudTracksLinkedPartitioning) => {
          console.warn('getUserTracks, data', data);
          this.data.tracks.next_href = data.next_href;
          const collection = this.processTracksCollection(data);
          const tracks: SoundcloudTracksLinkedPartitioning = {
            collection,
            next_href: data.next_href,
          };
          this.store.dispatch(new soundcloudActions.setSoundcloudState({ tracks }));
          def.resolve(tracks);
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
  public getTracksNextHref(): Promise<SoundcloudTrack[]> {
    return this.handlers
      .pipeHttpRequest<SoundcloudTracksLinkedPartitioning>(
        this.http.get<SoundcloudTracksLinkedPartitioning>(this.data.tracks.next_href),
      )
      .pipe(map(data => this.processTracksCollection(data)))
      .toPromise();
  }

  /**
   * Gets soundcloud playlist.
   * @param playlistId Soundcloud playlist id
   */
  public getPlaylist(playlistId: string | number): Promise<any> {
    const def: CustomDeferredService<any> = new CustomDeferredService<any>();
    SC.get(`/playlists/${playlistId}`)
      .then((playlist: SoundcloudPlaylist) => {
        playlist.description = this.processDescription(playlist.description);
        playlist.tracks = playlist.tracks.map((track: any) => {
          track.description = this.processDescription(track.description);
          return track;
        });
        this.store.dispatch(new soundcloudActions.setSoundcloudState({ playlist }));
        def.resolve(playlist);
      })
      .catch((error: any) => def.reject(error));
    return def.promise;
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
