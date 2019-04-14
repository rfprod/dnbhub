class IBlogPostLinks {
  bandcamp: string = '';
  facebook: string = '';
  instagram: string = '';
  soundcloud: string = '';
  twitter: string = '';
  website: string = '';
  youtube: string = '';
}

/**
 * Application blog post interface with initialization.
 */
export class IBlogPost {
  public code: string|null = null;
  public links: IBlogPostLinks = new IBlogPostLinks();
  public playlistId: any|null = null;
  public soundcloudUserId: string|null = null;
  public description: string|null = null;
}
