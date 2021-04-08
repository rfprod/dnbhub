import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { blogActions } from './blog.actions';
import {
  BLOG_STATE_TOKEN,
  IDnbhubBlogStateModel,
  TDnbhubBlogPayload,
  TDnbhubSelectBlogPostPayload,
} from './blog.interface';

@State<IDnbhubBlogStateModel>({
  name: BLOG_STATE_TOKEN,
  defaults: {
    posts: [],
    selectedPostId: 0,
    selectedPost: null,
  },
})
@Injectable()
export class DnbhubBlogState {
  @Selector()
  public static getState(state: IDnbhubBlogStateModel) {
    return state;
  }

  @Selector()
  public static getPosts(state: IDnbhubBlogStateModel) {
    return state.posts;
  }

  @Selector()
  public static getSelectedPost(state: IDnbhubBlogStateModel) {
    return state.selectedPost;
  }

  @Selector()
  public static listStartReached(state: IDnbhubBlogStateModel) {
    return state.selectedPostId === state.posts.length - 1;
  }

  @Selector()
  public static listEndReached(state: IDnbhubBlogStateModel) {
    return state.selectedPostId === 0;
  }

  @Action(blogActions.setDnbhubBlogState)
  public setDnbhubBlogState(
    ctx: StateContext<IDnbhubBlogStateModel>,
    { payload }: TDnbhubBlogPayload,
  ) {
    return ctx.patchState(payload);
  }

  @Action(blogActions.selectBlogPost)
  public selectBlogPost(
    ctx: StateContext<IDnbhubBlogStateModel>,
    { payload }: TDnbhubSelectBlogPostPayload,
  ) {
    const state = ctx.getState();
    const selectedPostId = state.posts.findIndex(item => item.code === payload.code);
    const selectedPost = state.posts[selectedPostId];
    return ctx.patchState({ selectedPostId, selectedPost });
  }

  @Action(blogActions.selectNextBlogPost)
  public selectNextBlogPost(ctx: StateContext<IDnbhubBlogStateModel>) {
    const state = ctx.getState();
    const selectedPostId =
      state.selectedPostId - 1 >= 0 ? state.selectedPostId - 1 : state.selectedPostId;
    const selectedPost = state.posts[selectedPostId];
    return ctx.patchState({ selectedPostId, selectedPost });
  }

  @Action(blogActions.selectPreviousBlogPost)
  public selectPreviousBlogPost(ctx: StateContext<IDnbhubBlogStateModel>) {
    const state = ctx.getState();
    const selectedPostId =
      state.selectedPostId + 1 < state.posts.length
        ? state.selectedPostId + 1
        : state.selectedPostId;
    const selectedPost = state.posts[selectedPostId];
    return ctx.patchState({ selectedPostId, selectedPost });
  }
}
