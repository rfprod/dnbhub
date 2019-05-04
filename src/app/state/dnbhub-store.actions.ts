import { IBlogPost } from 'src/app/interfaces/blog/blog-post.interface';

/**
 * Dnbhub store action.
 */
export class DnbhubStoreAction {
  static readonly type = '[DnbhubStore] Update state';
  constructor(
    public payload: {
      blogPost?: IBlogPost,
      scrollTopValue?: number
    }
  ) {
    console.log('DnbhubStoreAction constructor, payload', payload);
  }
}
