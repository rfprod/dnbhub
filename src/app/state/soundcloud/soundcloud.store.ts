import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import {
  SoundcloudMe,
  SoundcloudPlaylist,
  SoundcloudTracksLinkedPartitioning,
} from 'src/app/interfaces';

import { setSoundcloudState } from './soundcloud.actions';
import { ISoundcloudStateModel, SoundcloudPayload } from './soundcloud.interface';

export const soundcloudActions = {
  setSoundcloudState,
};

export const SOUNDCLOUD_STATE_TOKEN = new StateToken<ISoundcloudStateModel>('soundcloud');

@State<ISoundcloudStateModel>({
  name: SOUNDCLOUD_STATE_TOKEN,
  defaults: {
    me: new SoundcloudMe(),
    myPlaylists: [],
    tracks: new SoundcloudTracksLinkedPartitioning(),
    playlist: new SoundcloudPlaylist(),
  },
})
@Injectable()
export class SoundcloudState {
  @Selector()
  public static getState(state: ISoundcloudStateModel) {
    return state;
  }

  @Selector()
  public static getMe(state: ISoundcloudStateModel) {
    return state.me;
  }

  @Selector()
  public static getMyPlaylists(state: ISoundcloudStateModel) {
    return state.myPlaylists;
  }

  @Selector()
  public static getTracks(state: ISoundcloudStateModel) {
    return state.tracks;
  }

  @Selector()
  public static getPlaylist(state: ISoundcloudStateModel) {
    return state.playlist;
  }

  @Selector()
  public static allPlaylists(state: ISoundcloudStateModel) {
    return [...state.myPlaylists, state.playlist];
  }

  @Action(setSoundcloudState)
  public setSoundcloudState(
    ctx: StateContext<ISoundcloudStateModel>,
    { payload }: SoundcloudPayload,
  ) {
    return ctx.patchState(payload);
  }
}
