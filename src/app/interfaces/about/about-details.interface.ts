/**
 * Application about links interface with initialization.
 */
class IAboutLinks {
  bandcamp: string = '';
  facebook: string = '';
  instagram: string = '';
  mixcloud: string = '';
  soundcloud: string = '';
  twitter: string = '';
  rss: string = '';
  youtube: string = '';
}

class IPoweredBy {
  name: string = '';
  logo: string = '';
}

/**
 * Application about details interface with initialization.
 */
export class IAboutDetails {
  public links: IAboutLinks = new IAboutLinks();
  public soundcloudUserId: string = null;
  public text: string = null;
  public title: string = null;
  public widgetLink: string = null;
  public poweredBy: IPoweredBy[] = [new IPoweredBy()];
}
