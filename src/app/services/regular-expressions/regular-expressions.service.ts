import { Injectable } from "@angular/core";

/**
 * Application regular expressions service.
 */
@Injectable()
export class RegularExpressionsService {

  constructor() {
    console.log('RegularExpressionsService init');
  }

  /**
   * Regular expression patterns shared service.
   */
  private regExpPatterns: any = {
    email: /\w{2}@\w{2,}(\.)?\w{2,}/,
    soundcloudPlaylistLink: /^https:\/\/soundcloud\.com\/\w+[^/]*\/sets\/\w+[^/]*$/,
    brandName: /^[a-zA-Z0-9]{2,}$/,
    links: {
      bandcamp: /^https:\/\/\w+\.bandcamp\.com(\/)?$/,
      facebook: /^https:\/\/www\.facebook\.com\/[^/\s]+(\/)?$/,
      instagram: /^https:\/\/www\.instagram\.com\/[^/\s]+(\/)?$/,
      soundcloud: /^https:\/\/www\.soundcloud\.com\/[^/\s]+(\/)?$/,
      twitter: /^https:\/\/twitter\.com\/[^/\s]+(\/)?$/,
      website: /^http(s)?:\/\/(www\.)?[^/\s]+\.[a-z]{2,}(\/)?$/,
      youtube: /^https:\/\/www\.youtube\.com\/(c|user)\/[^/\s]+(\/)?$/
    },
    text: /\w{3,}/,
    name: /\w{2,}/,
    header: /\w{5,}/,
    message: /[\w\s_-]{75,}/,
    password: /\w{8,}/
  };

  public patterns(): any {
    return this.regExpPatterns;
  }

}
