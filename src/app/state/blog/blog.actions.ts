import { EmptyPayload, getActionCreator } from 'src/app/utils/ngxs.util';

import { TDnbhubBlogPayload, TDnbhubSelectBlogPostPayload } from './blog.interface';

const createAction = getActionCreator('Blog');

export const setDnbhubBlogState = createAction<TDnbhubBlogPayload>('Blog: set state');

export const selectBlogPost = createAction<TDnbhubSelectBlogPostPayload>('Blog: select post');

export const selectNextBlogPost = createAction<EmptyPayload>('Blog: select next post');

export const selectPreviousBlogPost = createAction<EmptyPayload>('Blog: select previous post');
