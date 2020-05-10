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
import { BehaviorSubject, combineLatest, timer } from 'rxjs';
import { concatMap, map, tap } from 'rxjs/operators';
import {
  IEventTargetWithPosition,
  IEventWithPosition,
  SoundcloudPlaylist,
} from 'src/app/interfaces/index';
import { SoundcloudTrack } from 'src/app/interfaces/soundcloud/soundcloud-track.config';
import { SoundcloudApiService } from 'src/app/state/soundcloud/soundcloud-api.service';
import { SoundcloudState } from 'src/app/state/soundcloud/soundcloud.store';
import { ETIMEOUT, WINDOW } from 'src/app/utils';

const renderPlaylistTracksDefault = 15;
const renderPlaylistTracksIncrement = 25;

export interface ISoundcloudPlayerConfig {
  user: { dnbhub: string };
  playlist: {
    everything: string;
    reposts1: string;
    reposts2: string;
    freedownloads: string;
    samplepacks: string;
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
  selector: 'app-soundcloud-player',
  templateUrl: './soundcloud-player.component.html',
  styleUrls: ['./soundcloud-player.component.scss'],
  inputs: ['mode', 'userId', 'playlistId'],
  host: {
    class: 'mat-body-1',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SoundcloudPlayerComponent implements OnChanges, OnDestroy {
  /**
   * Default config.
   */
  private readonly defaultConfig: ISoundcloudPlayerConfig = {
    user: {
      dnbhub: '1275637',
    },
    playlist: {
      everything: '21086473',
      reposts1: '108170272',
      reposts2: '502780338',
      freedownloads: '79430766',
      samplepacks: '234463958',
    },
  };

  /**
   * Soundcloud player mode.
   */
  @Input('mode') public mode: TSoundcloudPlayerMode = 'dnbhub';

  /**
   * Indicates if description should be shown.
   */
  @Input('displayDescription') public displayDescription = false;

  /**
   * Soundcloud user id.
   */
  @Input('userId') private userId: string | number = this.defaultConfig.user.dnbhub;

  /**
   * Soundcloud playlist id.
   */
  @Input('playlistId') private playlistId: string | number = this.defaultConfig.playlist.everything;

  constructor(
    private readonly store: Store,
    private readonly soundcloud: SoundcloudApiService,
    @Inject(WINDOW) private readonly window: Window,
  ) {}

  private readonly renderPlaylistTracks = new BehaviorSubject<number>(renderPlaylistTracksDefault);
  public readonly renderPlaylistTracks$ = this.renderPlaylistTracks.asObservable();

  /**
   * Soundcloud user tracks.
   */
  public tracks$ = this.store
    .select(SoundcloudState.getTracks)
    .pipe(map(tracks => tracks.collection));

  /**
   * Soundcloud playlist.
   */
  public readonly playlist$ = this.store.select(SoundcloudState.getPlaylist);

  public readonly playlistTracks$ = combineLatest([
    this.playlist$,
    this.renderPlaylistTracks$,
  ]).pipe(
    map(([playlist, renderPlaylistTracks]) => {
      const tracks = [...playlist.tracks].slice(0, renderPlaylistTracks);
      return tracks;
    }),
  );

  private readonly selectedTrackIndex = new BehaviorSubject<number>(0);
  public readonly selectedTrackIndex$ = this.selectedTrackIndex.asObservable();

  /**
   * Indicated that there's not more tracks left in the list.
   */
  private readonly noMoreTracks = new BehaviorSubject<boolean>(false);

  /**
   * Loading indicator, so that more tracks loading happens sequentially.
   */
  private readonly loading = new BehaviorSubject<boolean>(false);

  /**
   * Current Soundcloud player object.
   */
  public player: any;

  /**
   * Selects a track.
   */
  public selectTrack(index: number): void {
    this.selectedTrackIndex.next(index);
  }

  /**
   * Gets link with id from Soundcloud Service (public for template usage).
   */
  public getLinkWithId(href: string): string {
    return this.soundcloud.getLinkWithId(href);
  }

  /**
   * Loads more soundcloud tracks.
   */
  private loadMoreTracks(): void {
    if (!this.noMoreTracks.value && !this.loading.value) {
      this.loading.next(true);
      if (/(dnbhub|user)/.test(this.mode)) {
        this.soundcloud.getUserTracks(this.userId).then(
          data => {
            if (!Boolean(data.collection.length)) {
              this.noMoreTracks.next(true);
            }
            this.loading.next(false);
          },
          error => {
            this.loading.next(false);
          },
        );
      } else if (
        /(pl\-everything|pl\-reposts1|pl\-reposts2|pl\-freedownloads|pl\-samplepacks|playlist)/.test(
          this.mode,
        )
      ) {
        this.soundcloud.getPlaylist(this.playlistId).then(
          (playlist: SoundcloudPlaylist) => {
            this.noMoreTracks.next(true);
            this.loading.next(false);
          },
          error => {
            this.loading.next(false);
          },
        );
      }
    } else if (/(pl\-|playlist)/.test(this.mode)) {
      this.renderMorePlaylistTracks();
    }
  }

  /**
   * Renders more playlist tracks.
   */
  private renderMorePlaylistTracks(): void {
    const nextValue = this.renderPlaylistTracks.value + renderPlaylistTracksIncrement;
    this.renderPlaylistTracks.next(nextValue);
  }

  /**
   * Returns if playback is in progress, required for UI.
   */
  public playbackInProgress(): boolean {
    if (Boolean(this.player)) {
      return Boolean(this.player.isActuallyPlaying()) ? true : false;
    }
    return false;
  }

  /**
   * Kills player.
   */
  private playerKill(): void {
    if (Boolean(this.player)) {
      this.player.kill();
    }
  }

  /**
   * Triggers player playback/pause.
   * @param track Track object
   * @param trackIndex Track index in view component array
   */
  public playTrack(track: SoundcloudTrack, trackIndex: number): void {
    if (
      (this.selectedTrackIndex.value !== trackIndex && Boolean(this.player)) ||
      (this.selectedTrackIndex.value === trackIndex && !Boolean(this.player))
    ) {
      this.playerKill();
      this.selectTrack(trackIndex);

      this.soundcloud
        .streamTrack(track.id)
        .pipe(
          tap(player => {
            console.warn('soundcloud.streamTrack, player: ', player);
            this.player = player;
          }),
          concatMap(_ => timer(ETIMEOUT.SHORT).pipe()),
          tap(_ => {
            this.player.play();
            this.reportWaveformProgress();
          }),
        )
        .subscribe();
    } else if (Boolean(this.player.isActuallyPlaying())) {
      this.player.pause();
      clearInterval(this.waveformProgressInterval);
    } else {
      this.player.play();
      this.reportWaveformProgress();
    }
  }

  /**
   * Waveform progress interval.
   */
  private waveformProgressInterval: any;

  /**
   * Reports waveform progress to UI.
   */
  public reportWaveformProgress(): void {
    this.waveformProgressInterval = setInterval(() => {
      const visibleWaveform: ElementRef = new ElementRef(
        this.window.document.getElementsByClassName('waveform')[0],
      );
      const visibleWaveformElement: HTMLElement = visibleWaveform.nativeElement;
      const playbackProgress: number = Math.floor(
        (this.player.currentTime() * 100) / this.player.getDuration(),
      );
      const nextVal = playbackProgress + 1;
      visibleWaveformElement.style.background = `linear-gradient(to right, rgba(171,71,188,1) 0%,rgba(171,71,188,1) ${playbackProgress}%, rgba(30,87,153,0) ${nextVal}%, rgba(30,87,153,0) 100%)`;
    }, 1000);
  }

  /**
   * Waveform client event handler.
   * @param event waveform click event
   */
  public waveformClick(event: IEventWithPosition): void {
    console.log('waveformClick, event', event);
    const srcElement = event.srcElement as IEventTargetWithPosition;
    const waveformWidth: number = srcElement.clientWidth;
    const offsetX: number = event.offsetX;
    const percent: number = (offsetX * 100) / waveformWidth;
    const newProgress: number = (this.player.getDuration() * percent) / 100;
    this.player.seek(newProgress).then((data: any) => {
      console.warn('player seek success', data);
    });
  }

  /**
   * Resets player.
   * Is used when mode Input chanes.
   * Kills player, resets soundcloud service data, local data, local flags.
   * @param onlyProgress if only progress interval should be reset
   */
  private resetPlayer(onlyProgress?: boolean): void {
    if (!onlyProgress) {
      this.playerKill();
      this.soundcloud.resetServiceData();
      this.noMoreTracks.next(false);
      this.loading.next(false);
      this.renderPlaylistTracks.next(renderPlaylistTracksDefault);
    }
    clearInterval(this.waveformProgressInterval);
  }

  public ngOnChanges(changes: ISoundcloudPlayerChanges): void {
    if (changes.mode) {
      if (changes.mode.currentValue === 'dnbhub') {
        this.resetPlayer();
        this.userId = this.defaultConfig.user.dnbhub;
        this.loadMoreTracks();
      } else if (/pl\-/.test(changes.mode.currentValue)) {
        this.resetPlayer();
        const prefixLength = 3;
        const playlistKey = (changes.mode.currentValue as TSoundcloudPlayerMode).slice(
          prefixLength,
        );
        this.playlistId = this.defaultConfig.playlist[playlistKey];
        this.loadMoreTracks();
      }
    } else if (changes.userId) {
      if (this.mode === 'user' && Boolean(changes.userId.currentValue)) {
        this.resetPlayer();
        this.userId = changes.userId.currentValue;
        this.loadMoreTracks();
      }
    } else if (changes.playlistId) {
      if (this.mode === 'playlist' && Boolean(changes.playlistId.currentValue)) {
        this.resetPlayer();
        this.playlistId = changes.playlistId.currentValue;
        this.loadMoreTracks();
      }
    }
  }

  public ngOnDestroy(): void {
    this.resetPlayer();
  }

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
