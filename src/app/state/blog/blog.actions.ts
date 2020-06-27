import { getActionCreator, TEmptyPayload } from 'src/app/utils/ngxs.util';

import { TDnbhubBlogPayload, TDnbhubSelectBlogPostPayload } from './blog.interface';

const createAction = getActionCreator('Blog');

export const setDnbhubBlogState = createAction<TDnbhubBlogPayload>('Blog: set state');

export const selectBlogPost = createAction<TDnbhubSelectBlogPostPayload>('Blog: select post');

export const selectNextBlogPost = createAction<TEmptyPayload>('Blog: select next post');

export const selectPreviousBlogPost = createAction<TEmptyPayload>('Blog: select previous post');
