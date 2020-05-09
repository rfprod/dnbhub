import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject } from 'rxjs';
import { ISoundcloudPlaylist } from 'src/app/interfaces/index';
import { AppSpinnerService } from 'src/app/services';
import { EventEmitterService } from 'src/app/services/event-emitter/event-emitter.service';
import { SoundcloudService } from 'src/app/services/soundcloud/soundcloud.service';

const renderPlaylistTracksDefault = 15;
const renderPlaylistTracksIncrement = 25;

/**
 * Soundcloud player component.
 */
@UntilDestroy()
@Component({
  selector: 'app-soundcloud-player',
  templateUrl: './soundcloud-player.component.html',
  inputs: ['mode', 'userId', 'playlistId'],
  host: {
    class: 'mat-body-1',
  },
})
export class SoundcloudPlayerComponent implements OnInit, OnDestroy, OnChanges {
  /**
   * @param emitter Event emitter service - components interaction
   * @param spinenr Application spinner service
   * @param soundcloudService Soundcloud API wrapper
   * @param window Window reference
   */
  constructor(
    private readonly emitter: EventEmitterService,
    private readonly spinner: AppSpinnerService,
    private readonly soundcloudService: SoundcloudService,
    @Inject('Window') private readonly window: Window,
  ) {}

  /**
   * Soundcloud player mode.
   */
  @Input('mode') public mode:
    | 'dnbhub'
    | 'user'
    | 'pl-everything'
    | 'pl-reposts1'
    | 'pl-reposts2'
    | 'pl-freedownloads'
    | 'pl-samplepacks'
    | 'playlist' = 'dnbhub';

  /**
   * Predefined
   */
  private readonly predefinedIDs: {
    user: { dnbhub: string };
    playlist: {
      everything: string;
      reposts1: string;
      reposts2: string;
      freedownloads: string;
      samplepacks: string;
    };
  } = {
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
   * Indicates if description should be shown.
   */
  @Input('displayDescription') public displayDescription = false;

  /**
   * Soundcloud user id.
   */
  @Input('userId') private userId: string | number = '1275637';

  /**
   * Soundcloud playlist id.
   */
  @Input('playlistId') private playlistId: string | number = '21086473';

  private readonly renderPlaylistTracks = new BehaviorSubject<number>(renderPlaylistTracksDefault);

  /**
   * Soundcloud user tracks from shared service.
   */
  public tracks: any[] = this.soundcloudService.data.tracks.collection
    ? this.soundcloudService.data.tracks.collection.slice()
    : [];

  /**
   * Soundcloud playlist.
   */
  public playlist: ISoundcloudPlaylist =
    this.soundcloudService.data.playlist || new ISoundcloudPlaylist();

  /**
   * Selected track index.
   */
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
   * Indicates quantity of playlist tracks to be rendered.
   */
  public readonly renderPlaylistTracks$ = this.renderPlaylistTracks.asObservable();

  /**
   * Rendered playlist.
   */
  public renderedPlaylist: any[] =
    this.soundcloudService.data.playlist.tracks.slice(0, this.renderPlaylistTracks.value) || [];

  /**
   * Renders more playlist tracks.
   */
  private renderMorePlaylistTracks(): void {
    const nextValue =
      this.playlist.tracks.length - this.renderPlaylistTracks.value > renderPlaylistTracksIncrement
        ? this.renderPlaylistTracks.value + renderPlaylistTracksIncrement
        : this.playlist.tracks.length;
    this.renderPlaylistTracks.next(nextValue);
    this.renderedPlaylist =
      this.soundcloudService.data.playlist.tracks.slice(0, this.renderPlaylistTracks.value) || [];
  }

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
    return this.soundcloudService.getLinkWithId(href);
  }

  /**
   * Loads more soundcloud tracks.
   */
  private loadMoreTracks(): void {
    if (!this.noMoreTracks.value && !this.loading.value) {
      this.loading.next(true);
      this.spinner.startSpinner();
      if (/(dnbhub|user)/.test(this.mode)) {
        this.soundcloudService.getUserTracks(this.userId).then(
          (collection: any[]) => {
            if (!collection.length) {
              this.noMoreTracks.next(true);
            }
            this.tracks = this.soundcloudService.data.tracks.collection.slice();
            this.loading.next(false);
            this.spinner.stopSpinner();
          },
          (error: any) => {
            this.loading.next(false);
            this.spinner.stopSpinner();
          },
        );
      } else if (
        /(pl\-everything|pl\-reposts1|pl\-reposts2|pl\-freedownloads|pl\-samplepacks|playlist)/.test(
          this.mode,
        )
      ) {
        this.soundcloudService.getPlaylist(this.playlistId).then(
          (playlist: ISoundcloudPlaylist) => {
            this.noMoreTracks.next(true);
            this.playlist = this.soundcloudService.data.playlist;
            this.renderedPlaylist =
              this.soundcloudService.data.playlist.tracks.slice(
                0,
                this.renderPlaylistTracks.value,
              ) || [];
            this.loading.next(false);
            this.spinner.stopSpinner();
          },
          (error: any) => {
            this.loading.next(false);
            this.spinner.stopSpinner();
          },
        );
      }
    } else if (
      /(pl\-|playlist)/.test(this.mode) &&
      this.renderPlaylistTracks.value < this.playlist.tracks.length
    ) {
      this.renderMorePlaylistTracks();
    }
  }

  /**
   * Current Soundcloud player object.
   */
  public player: any;
  /**
   * Returns if playback is in progress, required for UI.
   */
  public playbackInProgress(): boolean {
    if (this.player) {
      return this.player.isActuallyPlaying() ? true : false;
    }
    return false;
  }
  /**
   * Kills player.
   */
  private playerKill(): void {
    if (this.player) {
      this.player.kill();
    }
  }
  /**
   * Triggers player playback/pause.
   * @param track Track object
   * @param trackIndex Track index in view component array
   */
  public playTrack(track: any, trackIndex: number): void {
    if (this.selectedTrackIndex.value !== trackIndex) {
      this.playerKill();
      this.selectTrack(trackIndex);
      this.spinner.startSpinner();
      this.soundcloudService.streamTrack(track.id).then(
        (player: any) => {
          console.warn('soundcloudService.streamTrack, player: ', player);
          this.player = player;
          setTimeout(() => {
            this.player.play();
            this.reportWaveformProgress();
            this.spinner.stopSpinner();
          }, 1000);
        },
        (error: any) => {
          this.spinner.stopSpinner();
        },
      );
    } else if (this.player.isActuallyPlaying()) {
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
    console.log('reportWaveformProgress');
    this.waveformProgressInterval = setInterval(() => {
      const visibleWaveform: ElementRef = new ElementRef(
        this.window.document.getElementsByClassName('waveform')[0],
      );
      console.log('this.player.currentTime', this.player.currentTime());
      console.log('this.player.getDuration', this.player.getDuration());
      const playbackProgress: number = Math.floor(
        (this.player.currentTime() * 100) / this.player.getDuration(),
      );
      const nextVal = playbackProgress + 1;
      console.log('playbackProgress', playbackProgress);
      visibleWaveform.nativeElement.style.background = `linear-gradient(to right, rgba(171,71,188,1) 0%,rgba(171,71,188,1) ${playbackProgress}%, rgba(30,87,153,0) ${nextVal}%, rgba(30,87,153,0) 100%)`;
    }, 1000);
  }
  /**
   * Waveform client event handler.
   * @param event waveform click event
   */
  public waveformClick(event: any): void {
    console.log('waveformClick, event', event);
    const waveformWidth: number = event.srcElement.clientWidth;
    const offsetX: number = event.offsetX;
    const percent: number = (offsetX * 100) / waveformWidth;
    const newProgress: number = (this.player.getDuration() * percent) / 100;
    this.player.seek(newProgress).then((data: any) => {
      console.log('player seek success', data);
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
      this.soundcloudService.resetServiceData();
      this.tracks = [];
      this.playlist = new ISoundcloudPlaylist();
      this.noMoreTracks.next(false);
    }
    clearInterval(this.waveformProgressInterval);
  }

  /**
   * Lifecycle hook called after component is initialized.
   */
  public ngOnInit(): void {
    this.loadMoreTracks();

    this.emitter
      .getEmitter()
      .pipe(untilDestroyed(this))
      .subscribe((event: any) => {
        console.log('SoundcloudPlayerComponent consuming event:', event);
        if (event.soundcloud === 'loadMoreTracks') {
          if (!this.noMoreTracks.value) {
            this.loadMoreTracks();
          }
        } else if (event.soundcloud === 'renderMoreTracks') {
          this.loadMoreTracks();
        }
      });
  }
  /**
   * Lifecycle hook called on input changes.
   */
  public ngOnChanges(changes: SimpleChanges): void {
    console.log('SoundcloudPlayerComponent, changes', changes);
    if (changes.mode) {
      if (changes.mode.currentValue === 'dnbhub') {
        this.resetPlayer();
        this.userId = this.predefinedIDs.user.dnbhub;
        this.loadMoreTracks();
      } else if (/pl\-/.test(changes.mode.currentValue)) {
        this.resetPlayer();
        const playlistKey: string = changes.mode.currentValue.slice(3);
        console.log('playlistKey', playlistKey);
        this.playlistId = this.predefinedIDs.playlist[playlistKey];
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

  /**
   * Lifecycle hook called after component is destroyed.
   */
  public ngOnDestroy(): void {
    this.resetPlayer(true);
  }
}
