/**
 * Brand interface.
 */
export class Brand {
  constructor(input?: Brand) {
    if (input) {
      const keys = Object.keys(input);
      for (const key of keys) {
        this[key] = input[key];
      }
    }
  }
  public name = '';
  public bandcamp = '';
  public facebook = '';
  public instagram = '';
  public soundcloud = '';
  public twitter = '';
  public website = '';
  public youtube = '';
}
