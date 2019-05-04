import { State, Selector, Action, StateContext } from '@ngxs/store';
import { DnbhubStoreAction } from './dnbhub-store.actions';

import { IBlogPost } from '../interfaces/blog/blog-post.interface';
import { IAboutDetails } from '../interfaces';

/**
 * Dnbhub store state model.
 */
export class DnbhubStoreStateModel {
  public blogPosts: IBlogPost[];
  public previousScrollTopValue: number;
  public details: IAboutDetails;
}

/**
 * Dnbhub store state.
 */
@State<DnbhubStoreStateModel>({
  name: 'dnbhubStore',
  defaults: {
    blogPosts: [],
    previousScrollTopValue: 0,
    details: new IAboutDetails()
  }
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
      blogPosts: (action.payload.blogPosts) ? [ ...state.blogPosts, ...action.payload.blogPosts ] : [ ...state.blogPosts ],
      previousScrollTopValue: action.payload.scrollTopValue || state.previousScrollTopValue,
      details: action.payload.details || state.details
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
