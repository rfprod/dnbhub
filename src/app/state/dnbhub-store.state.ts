import { State, Selector, Action, StateContext } from '@ngxs/store';
import { DnbhubStoreAction } from './dnbhub-store.actions';

import { IBlogPost } from '../interfaces/blog/blog-post.interface';

/**
 * Dnbhub store state model.
 */
export class DnbhubStoreStateModel {
  public blogPosts: IBlogPost[];
  public previousScrollTopValue: number;
}

/**
 * Dnbhub store state.
 */
@State<DnbhubStoreStateModel>({
  name: 'dnbhubStore',
  defaults: {
    blogPosts: [],
    previousScrollTopValue: 0
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
      blogPosts: (action.payload.blogPost) ? [ ...state.blogPosts, action.payload.blogPost ] : [ ...state.blogPosts ],
      previousScrollTopValue: action.payload.scrollTopValue
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
