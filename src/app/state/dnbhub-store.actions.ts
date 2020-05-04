import { IAboutDetails } from 'src/app/interfaces/about/about-details.interface';
import { IBlogPost } from 'src/app/interfaces/blog/blog-post.interface';

import { ISoundcloudPlaylist } from '../interfaces';

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
      blogPosts?: IBlogPost[];
      scrollTopValue?: number;
      details?: IAboutDetails;
      tracks?: any[]; // TODO soundcloud track interface
      playlist?: ISoundcloudPlaylist;
    },
  ) {
    console.log('DnbhubStoreAction constructor, payload', payload);
  }
}
