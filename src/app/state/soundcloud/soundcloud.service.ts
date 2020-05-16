import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { concatMap, mapTo } from 'rxjs/operators';

import { SoundcloudApiService } from './soundcloud-api.service';
import { ISoundcloudService } from './soundcloud.interface';
import { soundcloudActions, SoundcloudState } from './soundcloud.store';

@Injectable({
  providedIn: 'root',
})
export class SoundcloudService implements ISoundcloudService {
  constructor(private readonly store: Store, private readonly api: SoundcloudApiService) {}

  public readonly me$ = this.store.select(SoundcloudState.getMe);
  public readonly myPlaylists$ = this.store.select(SoundcloudState.getMyPlaylists);
  public readonly tracks$ = this.store.select(SoundcloudState.getTracks);
  public readonly playlist$ = this.store.select(SoundcloudState.getPlaylist);

  /**
   * TODO: types, and store wiring
   */
  public connect() {
    return this.api.connect();
  }

  public getMe(userId?: number) {
    return this.api
      .getMe(userId)
      .pipe(
        concatMap(me =>
          this.store.dispatch(new soundcloudActions.setSoundcloudState({ me })).pipe(mapTo(me)),
        ),
      );
  }

  public getMyPlaylists(userId: number) {
    return this.api
      .getMyPlaylists(userId)
      .pipe(
        concatMap(myPlaylists =>
          this.store
            .dispatch(new soundcloudActions.setSoundcloudState({ myPlaylists }))
            .pipe(mapTo(myPlaylists)),
        ),
      );
  }

  public getTracks(userId: number) {
    return this.api
      .getUserTracks(userId)
      .pipe(
        concatMap(tracks =>
          this.store
            .dispatch(new soundcloudActions.setSoundcloudState({ tracks }))
            .pipe(mapTo(tracks)),
        ),
      );
  }

  public getPlaylist(playlistId: number) {
    return this.api
      .getPlaylist(playlistId)
      .pipe(
        concatMap(playlist =>
          this.store
            .dispatch(new soundcloudActions.setSoundcloudState({ playlist }))
            .pipe(mapTo(playlist)),
        ),
      );
  }

  public streamTrack(trackId: number) {
    return this.api.streamTrack(trackId);
  }

  public getLinkWithId(href: string) {
    return this.api.getLinkWithId(href);
  }

  public resetData() {
    this.api.resetServiceData(); // TODO: this should be removed eventually
  }
}
