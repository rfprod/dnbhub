import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import {
  SoundcloudMe,
  SoundcloudPlaylist,
  SoundcloudTracksLinkedPartitioning,
} from 'src/app/interfaces';

import { setDnbhubSoundcloudState } from './soundcloud.actions';
import { IDnbhubSoundcloudStateModel, TDnbhubSoundcloudPayload } from './soundcloud.interface';

export const soundcloudActions = {
  setDnbhubSoundcloudState,
};

export const SOUNDCLOUD_STATE_TOKEN = new StateToken<IDnbhubSoundcloudStateModel>('soundcloud');

@State<IDnbhubSoundcloudStateModel>({
  name: SOUNDCLOUD_STATE_TOKEN,
  defaults: {
    me: new SoundcloudMe(),
    myPlaylists: [],
    tracks: new SoundcloudTracksLinkedPartitioning(),
    playlist: new SoundcloudPlaylist(),
  },
})
@Injectable({
  providedIn: 'root',
})
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
  public static getTracks(state: IDnbhubSoundcloudStateModel) {
    return state.tracks;
  }

  @Selector()
  public static getPlaylist(state: IDnbhubSoundcloudStateModel) {
    return state.playlist;
  }

  @Selector()
  public static allPlaylists(state: IDnbhubSoundcloudStateModel) {
    return [...state.myPlaylists, state.playlist];
  }

  @Action(setDnbhubSoundcloudState)
  public setDnbhubSoundcloudState(
    ctx: StateContext<IDnbhubSoundcloudStateModel>,
    { payload }: TDnbhubSoundcloudPayload,
  ) {
    return ctx.patchState(payload);
  }
}
