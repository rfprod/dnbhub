import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { IAboutDetails } from '../interfaces';
import { IBlogPost } from '../interfaces/blog/blog-post.interface';
import { DnbhubStoreAction } from './dnbhub-store.actions';

/**
 * Dnbhub store state model.
 */
export class DnbhubStoreStateModel {
  public blogPosts: IBlogPost[];
  public details: IAboutDetails;
}

/**
 * Dnbhub store state.
 * TODO: this store state should be eventually removed
 */
@State<DnbhubStoreStateModel>({
  name: 'dnbhubStore',
  defaults: {
    blogPosts: [],
    details: new IAboutDetails(),
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

  @Action(DnbhubStoreAction)
  public add(ctx: StateContext<DnbhubStoreStateModel>, action: DnbhubStoreAction) {
    const state = ctx.getState();
    ctx.setState({
      blogPosts: action.payload.blogPosts
        ? [...state.blogPosts, ...action.payload.blogPosts]
        : [...state.blogPosts],
      details: action.payload.details || state.details,
    });
  }
}
