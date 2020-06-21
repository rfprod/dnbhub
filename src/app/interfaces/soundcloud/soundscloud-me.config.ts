/* eslint-disable @typescript-eslint/naming-convention */
export class SoundcloudMe {
  constructor(input?: SoundcloudMe) {
    if (Boolean(input)) {
      const keys = Object.keys(input);
      for (const key of keys) {
        this[key] = input[key];
      }
    }
  }

  public id: number;

  public permalink: string;

  public username: string;

  public uri: string;

  public permalink_url: string;

  public avatar_url: string;

  public country: string;

  public full_name: string;

  public city: string;

  public description: string;

  public discogs_name: string;

  public myspace_name: string;

  public website: string;

  public website_title: string;

  public online: boolean;

  public track_count: number;

  public playlist_count: number;

  public followers_count: number;

  public followings_count: number;

  public public_favorites_count: number;

  public plan: string;

  public private_tracks_count: number;

  public private_playlists_count: number;

  public primary_email_confirmed: boolean;
}
