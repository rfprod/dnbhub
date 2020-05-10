import { EmptyPayload, getActionCreator } from 'src/app/utils/ngxs.util';

import { BlogPayload, SelectBlogPostPayload } from './blog.interface';

const createAction = getActionCreator('Blog');

export const setBlogState = createAction<BlogPayload>('Blog: set state');

export const selectBlogPost = createAction<SelectBlogPostPayload>('Blog: select post');

export const selectNextBlogPost = createAction<EmptyPayload>('Blog: select next post');

export const selectPreviousBlogPost = createAction<EmptyPayload>('Blog: select previous post');
