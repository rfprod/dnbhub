export class DnbhubAboutLinks {
  constructor(input?: DnbhubAboutLinks) {
    if (typeof input !== 'undefined') {
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

export class DnbhubAboutDetails {
  constructor(input?: DnbhubAboutDetails) {
    if (typeof input !== 'undefined') {
      const keys = Object.keys(input);
      for (const key of keys) {
        this[key] = input[key];
      }
    }
  }

  public links: DnbhubAboutLinks = new DnbhubAboutLinks();

  public soundcloudUserId?: string;

  public text?: string;

  public title?: string;

  public widgetLink?: string;
}
