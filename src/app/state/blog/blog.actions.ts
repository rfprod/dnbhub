import { getActionCreator, TEmptyPayload } from 'src/app/utils/ngxs.util';

import {
  BLOG_STATE_TOKEN,
  TDnbhubBlogPayload,
  TDnbhubSelectBlogPostPayload,
} from './blog.interface';

const createAction = getActionCreator(BLOG_STATE_TOKEN.toString());

export const setDnbhubBlogState = createAction<TDnbhubBlogPayload>('set state');

export const selectBlogPost = createAction<TDnbhubSelectBlogPostPayload>('select post');

export const selectNextBlogPost = createAction<TEmptyPayload>('select next post');

export const selectPreviousBlogPost = createAction<TEmptyPayload>('select previous post');
