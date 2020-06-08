/**
 * Application blog post links interface.
 */
export class BlogPostLinks {
  public bandcamp = '';
  public facebook = '';
  public instagram = '';
  public soundcloud = '';
  public twitter = '';
  public website = '';
  public youtube = '';
}

/**
 * Application blog post interface with initialization.
 */
export class BlogPost {
  constructor(input?: BlogPost) {
    if (input) {
      const keys = Object.keys(input);
      for (const key of keys) {
        this[key] = input[key];
      }
    }
  }
  public code: string | null = null;
  public links: BlogPostLinks = new BlogPostLinks();
  public playlistId: number = null;
  public soundcloudUserId: string | null = null;
  public description: string | null = null;
}
