/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/camelcase */

import { SoundcloudTrack } from './soundcloud-track.config';

/**
 * Soundcloud playlist interface.
 * API Documentation https://developers.soundcloud.com/docs/api/reference#playlists
 */
export class SoundcloudPlaylist {
  constructor(input?: SoundcloudPlaylist) {
    if (input) {
      const keys = Object.keys(input);
      for (const key of keys) {
        this[key] = input[key];
      }
    }
  }

  public kind = '';
  public id = 0;
  public created_at = '';
  public user_id = 0;
  public duration = 0;
  public sharing = '';
  public tag_list = '';
  public permalink = '';
  public track_count = 0;
  public streamable = false;
  public downloadable = false;
  public embeddable_by = '';
  public purchase_url: string | null = null;
  public label_id: string | null = null;
  public type = '';
  public playlist_type = '';
  public ean = '';
  public description = '';
  public genre = '';
  public release = '';
  public purchase_title: string | null = null;
  public label_name = '';
  public title = '';
  public release_year: string | number | null = null;
  public release_month: string | number | null = null;
  public release_day: string | number | null = null;
  public license = '';
  public uri = '';
  public permalink_url = '';
  public artwork_url = '';
  public user: {
    id: number;
    kind: string;
    permalink: string;
    username: string;
    uri: string;
    permalink_url: string;
    avatar_url: string;
  } = {
    id: 0,
    kind: '',
    permalink: '',
    username: '',
    uri: '',
    permalink_url: '',
    avatar_url: '',
  };
  public tracks: SoundcloudTrack[] = [];
}
