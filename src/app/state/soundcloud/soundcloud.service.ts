import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { SoundcloudPlaylist, SoundcloudTracksLinkedPartitioning } from 'src/app/interfaces';

import { SoundcloudMe } from '../../interfaces/soundcloud/soundscloud-me.config';
import { ISoundcloudService } from './soundcloud.interface';
import { soundcloudActions, SoundcloudState } from './soundcloud.store';

@Injectable({
  providedIn: 'root',
})
export class SoundcloudService implements ISoundcloudService {
  constructor(private readonly store: Store) {}

  public readonly me$ = this.store.select(SoundcloudState.getMe);
  public readonly myPlaylists$ = this.store.select(SoundcloudState.getMyPlaylists);
  public readonly tracks$ = this.store.select(SoundcloudState.getTracks);
  public readonly playlist$ = this.store.select(SoundcloudState.getPlaylist);

  /**
   * TODO: use http service to get data and update state
   */
  public getMe() {
    return this.store.dispatch(
      new soundcloudActions.setSoundcloudState({ me: new SoundcloudMe() }),
    );
  }

  /**
   * TODO: use http service to get data and update state
   */
  public getMyPlaylists() {
    return this.store.dispatch(new soundcloudActions.setSoundcloudState({ myPlaylists: [] }));
  }

  /**
   * TODO: use http service to get data and update state
   */
  public getTracks() {
    return this.store.dispatch(
      new soundcloudActions.setSoundcloudState({
        tracks: new SoundcloudTracksLinkedPartitioning(),
      }),
    );
  }

  /**
   * TODO: use http service to get data and update state
   */
  public getPlaylist() {
    return this.store.dispatch(
      new soundcloudActions.setSoundcloudState({ playlist: new SoundcloudPlaylist() }),
    );
  }
}
