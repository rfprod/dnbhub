import { DnbhubBrand } from '../brand';

export class DnbhubBlogPostLinks {
  constructor(input?: Partial<DnbhubBlogPostLinks | DnbhubBrand>) {
    if (Boolean(input)) {
      const keys = Object.keys(input);
      for (const key of keys) {
        const value = input[key];
        this[key] = value ?? this[key];
      }
    }
  }

  public readonly bandcamp = '';

  public readonly facebook = '';

  public readonly instagram = '';

  public readonly soundcloud = '';

  public readonly twitter = '';

  public readonly website = '';

  public readonly youtube = '';
}

export class DnbhubBlogPost {
  constructor(input?: DnbhubBlogPost) {
    if (Boolean(input)) {
      const keys = Object.keys(input);
      for (const key of keys) {
        const value = input[key];
        this[key] = value ?? this[key];
      }
    }
  }

  public readonly code: string | null = null;

  public readonly links: DnbhubBlogPostLinks = new DnbhubBlogPostLinks();

  public readonly playlistId: number = null;

  public readonly soundcloudUserId: string | null = null;

  public readonly description: string | null = null;
}
