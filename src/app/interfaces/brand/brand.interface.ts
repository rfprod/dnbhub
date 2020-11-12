export class DnbhubBrand {
  constructor(input?: DnbhubBrand) {
    if (typeof input !== 'undefined') {
      const keys = Object.keys(input);
      for (const key of keys) {
        const value = input[key];
        this[key] = value ?? this[key];
      }
    }
  }

  public readonly key?: string;

  public readonly name = '';

  public readonly bandcamp = '';

  public readonly facebook = '';

  public readonly instagram = '';

  public readonly soundcloud = '';

  public readonly twitter = '';

  public readonly website = '';

  public readonly youtube = '';
}
