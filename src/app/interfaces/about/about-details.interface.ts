/**
 * Application about links interface with initialization.
 */
export class AboutLinks {
  constructor(input?: AboutLinks) {
    if (input) {
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

export class PoweredBy {
  constructor(input?: PoweredBy) {
    if (input) {
      const keys = Object.keys(input);
      for (const key of keys) {
        this[key] = input[key];
      }
    }
  }
  public name = '';
  public logo = '';
}

/**
 * Application about details interface with initialization.
 */
export class AboutDetails {
  constructor(input?: AboutDetails) {
    if (input) {
      const keys = Object.keys(input);
      for (const key of keys) {
        this[key] = input[key];
      }
    }
  }
  public links: AboutLinks = new AboutLinks();
  public soundcloudUserId: string = null;
  public text: string = null;
  public title: string = null;
  public widgetLink: string = null;
  public poweredBy: PoweredBy[] = [new PoweredBy()];
}
