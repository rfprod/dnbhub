import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { IAboutDetails, ISoundcloudPlaylist } from '../interfaces';
import { IBlogPost } from '../interfaces/blog/blog-post.interface';
import { DnbhubStoreAction } from './dnbhub-store.actions';

/**
 * Dnbhub store state model.
 */
export class DnbhubStoreStateModel {
  public blogPosts: IBlogPost[];
  public previousScrollTopValue: number;
  public details: IAboutDetails;
  public tracks: any[]; // TODO soundcloud track interface
  public playlist: ISoundcloudPlaylist;
}

/**
 * Dnbhub store state.
 */
@State<DnbhubStoreStateModel>({
  name: 'dnbhubStore',
  defaults: {
    blogPosts: [],
    previousScrollTopValue: 0,
    details: new IAboutDetails(),
    tracks: [],
    playlist: new ISoundcloudPlaylist(),
  },
})
@Injectable()
export class DnbhubStoreState {
  @Selector()
  public static getState(state: DnbhubStoreStateModel) {
    return state;
  }

  @Selector()
  public static getBlog(state: DnbhubStoreStateModel) {
    return state.blogPosts;
  }

  @Selector()
  public static getAbout(state: DnbhubStoreStateModel) {
    return state.details;
  }

  @Selector()
  public static getScrollTopValue(state: DnbhubStoreStateModel) {
    return state.previousScrollTopValue;
  }

  @Action(DnbhubStoreAction)
  public add(ctx: StateContext<DnbhubStoreStateModel>, action: DnbhubStoreAction) {
    const state = ctx.getState();
    ctx.setState({
      blogPosts: action.payload.blogPosts
        ? [...state.blogPosts, ...action.payload.blogPosts]
        : [...state.blogPosts],
      previousScrollTopValue: action.payload.scrollTopValue || state.previousScrollTopValue,
      details: action.payload.details || state.details,
      tracks: action.payload.tracks
        ? [...state.tracks, ...action.payload.tracks]
        : [...state.tracks],
      playlist: action.payload.playlist || state.playlist,
    });
  }
}
