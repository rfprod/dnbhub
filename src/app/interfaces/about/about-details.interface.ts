/**
 * Application about links interface with initialization.
 */
export class IAboutLinks {
  public bandcamp = '';
  public facebook = '';
  public instagram = '';
  public mixcloud = '';
  public soundcloud = '';
  public twitter = '';
  public rss = '';
  public youtube = '';
}

export class IPoweredBy {
  public name = '';
  public logo = '';
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
