/**
 * Application blog post links interface.
 */
export class IBlogPostLinks {
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
export class IBlogPost {
  public code: string | null = null;
  public links: IBlogPostLinks = new IBlogPostLinks();
  public playlistId: any | null = null;
  public soundcloudUserId: string | null = null;
  public description: string | null = null;
}
