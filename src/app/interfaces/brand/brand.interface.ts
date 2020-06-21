/**
 * Brand interface.
 */
export class Brand {
  constructor(input?: Brand) {
    if (Boolean(input)) {
      const keys = Object.keys(input);
      for (const key of keys) {
        this[key] = input[key];
      }
    }
  }

  public key?: string;

  public name = '';

  public bandcamp = '';

  public facebook = '';

  public instagram = '';

  public soundcloud = '';

  public twitter = '';

  public website = '';

  public youtube = '';
}

export interface IBrands {
  [key: string]: Brand;
}
