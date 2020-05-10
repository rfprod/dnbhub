import { IAboutDetails } from 'src/app/interfaces/about/about-details.interface';
import { IBlogPost } from 'src/app/interfaces/blog/blog-post.interface';

export class DnbhubStoreAction {
  public static readonly type = '[DnbhubStore] Update state';

  constructor(
    public payload: {
      blogPosts?: IBlogPost[];
      details?: IAboutDetails;
    },
  ) {}
}
