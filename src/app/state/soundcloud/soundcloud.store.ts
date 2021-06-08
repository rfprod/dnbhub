import { Injectable } from '@angular/core';
import { Action, createSelector, Selector, State, StateContext } from '@ngxs/store';

import { soundcloudActions } from './soundcloud.actions';
import {
  IDnbhubSoundcloudStateModel,
  SOUNDCLOUD_STATE_TOKEN,
  soundcloudStoreInitialState,
  TDnbhubSoundcloudPayload,
} from './soundcloud.interface';

@State<IDnbhubSoundcloudStateModel>({
  name: SOUNDCLOUD_STATE_TOKEN,
  defaults: {
    ...soundcloudStoreInitialState,
  },
})
@Injectable()
export class DnbhubSoundcloudState {
  @Selector()
  public static getState(state: IDnbhubSoundcloudStateModel) {
    return state;
  }

  @Selector()
  public static getMe(state: IDnbhubSoundcloudStateModel) {
    return state.me;
  }

  @Selector()
  public static getMyPlaylists(state: IDnbhubSoundcloudStateModel) {
    return state.myPlaylists;
  }

  @Selector()
  public static getSpotlight(state: IDnbhubSoundcloudStateModel) {
    return state.spotlight;
  }

  @Selector()
  public static getTracks(state: IDnbhubSoundcloudStateModel) {
    return state.tracks;
  }

  @Selector()
  public static getPlaylists(state: IDnbhubSoundcloudStateModel) {
    return state.playlists;
  }

  @Selector()
  public static allPlaylists(state: IDnbhubSoundcloudStateModel) {
    return [...state.myPlaylists, ...state.playlists];
  }

  public static playlistById(id: number) {
    return createSelector(
      [this],
      (state: IDnbhubSoundcloudStateModel) =>
        state.myPlaylists.filter(playlist => playlist.id === id)[0],
    );
  }

  @Action(soundcloudActions.setDnbhubSoundcloudState)
  public setDnbhubSoundcloudState(
    ctx: StateContext<IDnbhubSoundcloudStateModel>,
    { payload }: TDnbhubSoundcloudPayload,
  ) {
    return ctx.patchState(payload);
  }
}
