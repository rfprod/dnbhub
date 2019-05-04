import { IBlogPost } from 'src/app/interfaces/blog/blog-post.interface';
import { IAboutDetails } from 'src/app/interfaces/about/about-details.interface';

/**
 * Dnbhub store action.
 */
export class DnbhubStoreAction {

  /**
   * Dnbhub Store Action type.
   */
  static readonly type = '[DnbhubStore] Update state';

  /**
   * DnbhubStoreAction constructor.
   * @param payload Dnbhub store action payload
   */
  constructor(
    public payload: {
      blogPosts?: IBlogPost[],
      scrollTopValue?: number,
      details?: IAboutDetails
    }
  ) {
    console.log('DnbhubStoreAction constructor, payload', payload);
  }

}
