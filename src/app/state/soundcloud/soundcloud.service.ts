import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { concatMap, mapTo } from 'rxjs/operators';
import { SoundcloudMe } from 'src/app/interfaces/soundcloud/soundscloud-me.config';

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

  public getMe() {
    // TODO
    return this.store.dispatch(
      new soundcloudActions.setSoundcloudState({ me: new SoundcloudMe() }),
    );
  }

  public getMyPlaylists() {
    // TODO
    return this.store.dispatch(new soundcloudActions.setSoundcloudState({ myPlaylists: [] }));
  }

  public getTracks(userId: string | number) {
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

  public getPlaylist(playlistId: string | number) {
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

  public streamTrack(trackId: string | number) {
    return this.api.streamTrack(trackId);
  }

  public getLinkWithId(href: string) {
    return this.api.getLinkWithId(href);
  }

  public resetData() {
    this.api.resetServiceData(); // TODO: this should be removed eventually
  }
}
