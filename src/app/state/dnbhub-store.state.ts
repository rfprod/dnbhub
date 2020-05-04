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
export class DnbhubStoreState {
  /**
   * Adds state.
   * @param ctx context
   * @param action action
   */
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

  /**
   * Returns blog posts.
   * @param state state
   */
  @Selector()
  static getBlog(state: DnbhubStoreStateModel) {
    return state.blogPosts;
  }

  /**
   * Returns previous scroll top value.
   * @param state state
   */
  @Selector()
  static getScrollTopValue(state: DnbhubStoreStateModel) {
    return state.previousScrollTopValue;
  }
}
