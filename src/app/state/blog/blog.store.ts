import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import {
  selectBlogPost,
  selectNextBlogPost,
  selectPreviousBlogPost,
  setBlogState,
} from './blog.actions';
import { BlogPayload, IBlogStateModel, SelectBlogPostPayload } from './blog.interface';

export const blogActions = {
  setBlogState,
  selectBlogPost,
  selectNextBlogPost,
  selectPreviousBlogPost,
};

@State<IBlogStateModel>({
  name: 'blog',
  defaults: {
    posts: [],
    selectedPostId: 0,
    selectedPost: null,
  },
})
@Injectable()
export class BlogState {
  @Selector()
  public static getState(state: IBlogStateModel) {
    return state;
  }

  @Selector()
  public static getPosts(state: IBlogStateModel) {
    return state.posts;
  }

  @Selector()
  public static getSelectedPost(state: IBlogStateModel) {
    return state.selectedPost;
  }

  @Selector()
  public static listStartReached(state: IBlogStateModel) {
    return state.selectedPostId === state.posts.length - 1;
  }

  @Selector()
  public static listEndReached(state: IBlogStateModel) {
    return state.selectedPostId === 0;
  }

  @Action(setBlogState)
  public setBlogState(ctx: StateContext<IBlogStateModel>, { payload }: BlogPayload) {
    return ctx.patchState(payload);
  }

  @Action(selectBlogPost)
  public selectBlogPost(ctx: StateContext<IBlogStateModel>, { payload }: SelectBlogPostPayload) {
    const state = ctx.getState();
    const selectedPostId = state.posts.findIndex(item => item.code === payload.code);
    const selectedPost = state.posts[selectedPostId];
    return ctx.patchState({ selectedPostId, selectedPost });
  }

  @Action(selectNextBlogPost)
  public selectNextBlogPost(ctx: StateContext<IBlogStateModel>) {
    const state = ctx.getState();
    const selectedPostId =
      state.selectedPostId - 1 >= 0 ? state.selectedPostId - 1 : state.selectedPostId;
    const selectedPost = state.posts[selectedPostId];
    return ctx.patchState({ selectedPostId, selectedPost });
  }

  @Action(selectPreviousBlogPost)
  public selectPreviousBlogPost(ctx: StateContext<IBlogStateModel>) {
    const state = ctx.getState();
    const selectedPostId =
      state.selectedPostId + 1 < state.posts.length
        ? state.selectedPostId + 1
        : state.selectedPostId;
    const selectedPost = state.posts[selectedPostId];
    return ctx.patchState({ selectedPostId, selectedPost });
  }
}
