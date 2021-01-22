import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { Store } from '@ngxs/store';
import { BehaviorSubject, combineLatest, from, of, timer } from 'rxjs';
import { concatMap, first, map, mapTo, takeWhile, tap } from 'rxjs/operators';
import { IEventTargetWithPosition, IEventWithPosition } from 'src/app/interfaces/index';
import { ISoundcloudPlayer } from 'src/app/interfaces/soundcloud/soundcloud-player.interface';
import {
  ISoundcloudTrack,
  trackDefaultValues,
} from 'src/app/interfaces/soundcloud/soundcloud-track.config';
import { DnbhubHttpProgressState } from 'src/app/state/http-progress/http-progress.store';
import { DnbhubSoundcloudState } from 'src/app/state/soundcloud/soundcloud.store';
import { TIMEOUT, WINDOW } from 'src/app/utils';

import { DnbhubSoundcloudService } from '../../state/soundcloud/soundcloud.service';

const renderPlaylistTracksDefault = 10;
const renderPlaylistTracksIncrement = 25;

export interface ISoundcloudPlayerConfig {
  user: { dnbhub: number };
  playlist: {
    everything: number;
    reposts1: number;
    reposts2: number;
    freedownloads: number;
    samplepacks: number;
  };
}

export interface ISoundcloudPlayerChanges extends SimpleChanges {
  mode: SimpleChange;
  displayDescription: SimpleChange;
  useId: SimpleChange;
  playlistId: SimpleChange;
}

export type TSoundcloudPlayerMode =
  | 'dnbhub'
  | 'user'
  | 'pl-everything'
  | 'pl-reposts1'
  | 'pl-reposts2'
  | 'pl-freedownloads'
  | 'pl-samplepacks'
  | 'playlist';

/**
 * Soundcloud player component.
 */
@Component({
  selector: 'dnbhub-soundcloud-player',
  templateUrl: './soundcloud-player.component.html',
  styleUrls: ['./soundcloud-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DnbhubSoundcloudPlayerComponent implements OnChanges, OnDestroy {
  /**
   * Default config.
   */
  private readonly defaultConfig: ISoundcloudPlayerConfig = {
    user: {
      dnbhub: 1275637,
    },
    playlist: {
      everything: 21086473,
      reposts1: 108170272,
      reposts2: 502780338,
      freedownloads: 79430766,
      samplepacks: 234463958,
    },
  };

  /**
   * Soundcloud player mode.
   */
  @Input() public mode: TSoundcloudPlayerMode = 'dnbhub';

  /**
   * Indicates if description should be shown.
   */
  @Input() public displayDescription = false;

  /**
   * Soundcloud user id.
   */
  @Input() private userId: number = this.defaultConfig.user.dnbhub;

  /**
   * Soundcloud playlist id.
   */
  @Input() private playlistId: number = this.defaultConfig.playlist.everything;

  private readonly loading$ = this.store.select(DnbhubHttpProgressState.mainViewProgress);

  constructor(
    private readonly store: Store,
    private readonly soundcloud: DnbhubSoundcloudService,
    @Inject(WINDOW) private readonly window: Window,
  ) {}

  private readonly renderPlaylistTracks = new BehaviorSubject<number>(renderPlaylistTracksDefault);

  public readonly renderPlaylistTracks$ = this.renderPlaylistTracks.asObservable();

  /**
   * Soundcloud user tracks.
   */
  public tracks$ = this.store
    .select(DnbhubSoundcloudState.getTracks)
    .pipe(map(tracks => tracks.collection));

  /**
   * Soundcloud playlist.
   */
  public playlist$ = this.store
    .select(DnbhubSoundcloudState.allPlaylists)
    .pipe(map(playlists => playlists.find(item => item.id === this.playlistId)));

  public readonly playlistTracks$ = combineLatest([
    this.playlist$,
    this.renderPlaylistTracks$,
  ]).pipe(
    map(([playlist, renderPlaylistTracks]) => {
      const tracks = Boolean(playlist)
        ? [...(playlist?.tracks ?? [])].slice(0, renderPlaylistTracks)
        : [];
      return tracks;
    }),
  );

  private readonly playerMode = new BehaviorSubject<TSoundcloudPlayerMode>(this.mode);

  public readonly playerMode$ = this.playerMode.asObservable();

  public readonly renderTracks$ = this.playerMode$.pipe(
    concatMap(mode => {
      return mode === 'dnbhub' || mode === 'user' ? this.tracks$ : this.playlistTracks$;
    }),
  );

  private readonly selectedTrack = new BehaviorSubject<ISoundcloudTrack>({ ...trackDefaultValues });

  public readonly selectedTrack$ = this.selectedTrack.asObservable();

  /**
   * Indicated that there's not more tracks left in the list.
   */
  private readonly noMoreTracks = new BehaviorSubject<boolean>(false);

  /**
   * Current Soundcloud player object.
   */
  public player?: ISoundcloudPlayer;

  /**
   * Waveform progress timer.
   */
  private readonly waveformProgressTimer$ = timer(TIMEOUT.SHORT, TIMEOUT.SHORT);

  /**
   * Gets link with id from Soundcloud Service (public for template usage).
   */
  public getLinkWithId(href: string = ''): string {
    return this.soundcloud.getLinkWithId(href);
  }

  /**
   * Loads more soundcloud tracks.
   */
  private loadMoreTracks() {
    void this.loading$
      .pipe(
        first(),
        concatMap(loading => {
          if (!this.noMoreTracks.value) {
            if (/(dnbhub|user)/.test(this.mode)) {
              return this.soundcloud.getTracks(this.userId).pipe(
                tap(data => {
                  if (!Boolean(data.next_href)) {
                    this.noMoreTracks.next(true);
                  }
                }),
              );
            } else if (
              /(pl-everything|pl-reposts1|pl-reposts2|pl-freedownloads|pl-samplepacks|playlist)/.test(
                this.mode,
              )
            ) {
              return this.soundcloud.getPlaylist(this.playlistId).pipe(
                tap(() => {
                  this.noMoreTracks.next(true);
                }),
              );
            }
          } else if (/(pl-|playlist)/.test(this.mode)) {
            this.renderMorePlaylistTracks();
            return of();
          }
          return of();
        }),
      )
      .subscribe();
  }

  /**
   * Renders more playlist tracks.
   */
  private renderMorePlaylistTracks(): void {
    const nextValue = this.renderPlaylistTracks.value + renderPlaylistTracksIncrement;
    this.renderPlaylistTracks.next(nextValue);
  }

  /**
   * Kills player.
   */
  private playerKill(): void {
    if (typeof this.player !== 'undefined') {
      this.player.kill();
    }
  }

  /**
   * Triggers player playback/pause.
   * @param track Track object
   */
  public playTrack(track: ISoundcloudTrack): void {
    if (typeof this.player !== 'undefined') {
      if (this.selectedTrack.value.id !== track.id) {
        this.playerKill();
        this.selectedTrack.next(track);

        void this.soundcloud
          .streamTrack(track.id ?? 0)
          .pipe(
            concatMap((player: ISoundcloudPlayer) => {
              this.player = player;
              const promise = this.player.play();
              return from(promise).pipe(mapTo(player));
            }),
            tap(() => {
              /**
               * @note TODO: refactor, remove nested subscription, remove rule override for this file in .eslintrc.js
               */
              void this.reportWaveformProgress().subscribe();
            }),
          )
          .subscribe();
      } else if (Boolean(this.player.isActuallyPlaying())) {
        void this.player.pause();
      } else {
        const promise = this.player.play();
        void from(promise)
          .pipe(concatMap(() => this.reportWaveformProgress()))
          .subscribe();
      }
    }
  }

  /**
   * Renders waveform progress in UI.
   */
  public reportWaveformProgress() {
    return this.waveformProgressTimer$.pipe(
      tap(() => {
        const id = this.selectedTrack.value.id;
        const visibleWaveform: ElementRef = new ElementRef(
          this.window.document.getElementsByClassName(`waveform-${id}`)[0],
        );
        const visibleWaveformElement: HTMLElement = visibleWaveform.nativeElement;
        if (Boolean(visibleWaveformElement) && typeof this.player !== 'undefined') {
          const dividend = 100;
          const playbackProgress: number = Math.floor(
            (this.player.currentTime() * dividend) / this.player.getDuration(),
          );
          const nextVal = playbackProgress + 1;
          visibleWaveformElement.style.background = `linear-gradient(to right, rgba(171,71,188,1) 0%,rgba(171,71,188,1) ${playbackProgress}%, rgba(30,87,153,0) ${nextVal}%, rgba(30,87,153,0) 100%)`;
        }
      }),
      takeWhile(
        () =>
          typeof this.player !== 'undefined' &&
          this.player.isActuallyPlaying() &&
          !this.player.isDead() &&
          !this.player.isEnded(),
      ),
    );
  }

  /**
   * Waveform client event handler.
   * @param event waveform click event
   * @param id soundcloud track id
   */
  public waveformClick(event: IEventWithPosition, id: number = 0): void {
    if (this.selectedTrack.value.id === id && typeof this.player !== 'undefined') {
      const srcElement = event.srcElement as IEventTargetWithPosition;
      const waveformWidth: number = srcElement.clientWidth;
      const offsetX: number = event.offsetX;
      const dividend = 100;
      const percent: number = (offsetX * dividend) / waveformWidth;
      const newProgress: number = (this.player.getDuration() * percent) / dividend;
      void this.player.seek(newProgress);
    }
  }

  /**
   * Resets player.
   * Is used when mode Input chanes.
   * Kills player, resets soundcloud service data, local data, local flags.
   * @param onlyProgress if only progress interval should be reset
   */
  private resetPlayer(onlyProgress?: boolean): void {
    if (!Boolean(onlyProgress)) {
      this.playerKill();
      this.soundcloud.resetData();
      this.noMoreTracks.next(false);
      this.renderPlaylistTracks.next(renderPlaylistTracksDefault);
    }
  }

  /**
   * Should be used in ngOnChanges handler.
   * @param changes input changes
   */
  private modeChangeHandler(changes: ISoundcloudPlayerChanges): void {
    if (changes.mode.currentValue === 'dnbhub') {
      this.resetPlayer();
      this.userId = this.defaultConfig.user.dnbhub;
      this.loadMoreTracks();
    } else if (Boolean((changes.mode.currentValue as string).includes('pl-'))) {
      this.resetPlayer();
      const prefixLength = 3;
      const playlistKey = (changes.mode.currentValue as TSoundcloudPlayerMode).slice(prefixLength);
      this.playlistId = this.defaultConfig.playlist[playlistKey];
      this.loadMoreTracks();
    }
  }

  /**
   * Should be used in ngOnChanges handler.
   * @param changes input changes
   */
  private userIdChangeHandler(changes: ISoundcloudPlayerChanges): void {
    if (this.mode === 'user' && Boolean(changes.userId.currentValue)) {
      this.resetPlayer();
      this.userId = changes.userId.currentValue;
      this.loadMoreTracks();
    }
  }

  /**
   * Should be used in ngOnChanges handler.
   * @param changes input changes
   */
  private playlistIdChangeHandler(changes: ISoundcloudPlayerChanges): void {
    if (this.mode === 'playlist' && Boolean(changes.playlistId.currentValue)) {
      this.resetPlayer();
      this.playlistId = changes.playlistId.currentValue;
      this.loadMoreTracks();
    }
  }

  public ngOnChanges(changes: ISoundcloudPlayerChanges): void {
    if (Boolean(changes.mode)) {
      this.playerMode.next(changes.mode.currentValue);
    }
    if (Boolean(changes.mode) && !Boolean(changes.playlistId) && !Boolean(changes.userId)) {
      this.modeChangeHandler(changes);
    } else if (Boolean(changes.userId)) {
      this.userIdChangeHandler(changes);
    } else if (Boolean(changes.playlistId)) {
      this.playlistIdChangeHandler(changes);
    }
  }

  public ngOnDestroy(): void {
    this.resetPlayer();
  }

  /**
   * Host element scroll listener.
   * @param event scroll event
   */
  @HostListener('scroll', ['$event'])
  public scrollHandler(event: Event): void {
    const target = event.target as IEventTargetWithPosition;
    const scrollFromBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
    const loadMoreOffset = 20;
    if (scrollFromBottom < loadMoreOffset) {
      this.loadMoreTracks();
    }
  }
}
