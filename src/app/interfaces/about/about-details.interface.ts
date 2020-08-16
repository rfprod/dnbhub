/**
 * Application about links interface with initialization.
 */
export class DnbhubAboutLinks {
  constructor(input?: DnbhubAboutLinks) {
    if (Boolean(input)) {
      const keys = Object.keys(input);
      for (const key of keys) {
        this[key] = input[key];
      }
    }
  }

  public bandcamp = '';

  public facebook = '';

  public instagram = '';

  public mixcloud = '';

  public soundcloud = '';

  public twitter = '';

  public rss = '';

  public youtube = '';
}

/**
 * Application about details interface with initialization.
 */
export class DnbhubAboutDetails {
  constructor(input?: DnbhubAboutDetails) {
    if (Boolean(input)) {
      const keys = Object.keys(input);
      for (const key of keys) {
        this[key] = input[key];
      }
    }
  }

  public links: DnbhubAboutLinks = new DnbhubAboutLinks();

  public soundcloudUserId: string = null;

  public text: string = null;

  public title: string = null;

  public widgetLink: string = null;
}
