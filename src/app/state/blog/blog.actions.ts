import { getActionCreator, TEmptyPayload } from 'src/app/utils/ngxs.util';

import {
  BLOG_STATE_TOKEN,
  TDnbhubBlogPayload,
  TDnbhubSelectBlogPostPayload,
} from './blog.interface';

const createAction = getActionCreator(BLOG_STATE_TOKEN.toString());

const setDnbhubBlogState = createAction<TDnbhubBlogPayload>('set state');

const selectBlogPost = createAction<TDnbhubSelectBlogPostPayload>('select post');

const selectNextBlogPost = createAction<TEmptyPayload>('select next post');

const selectPreviousBlogPost = createAction<TEmptyPayload>('select previous post');

export const blogActions = {
  setDnbhubBlogState,
  selectBlogPost,
  selectNextBlogPost,
  selectPreviousBlogPost,
};
