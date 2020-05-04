/* eslint-disable @typescript-eslint/camelcase */
/**
 * Soundcloud playlist interface.
 * API Documentation https://developers.soundcloud.com/docs/api/reference#playlists
 */
export class ISoundcloudPlaylist {
  constructor(input?: ISoundcloudPlaylist) {
    if (input) {
      this.kind = input.kind;
      this.id = input.id;
      this.created_at = input.created_at;
      this.user_id = input.user_id;
      this.duration = input.duration;
      this.sharing = input.sharing;
      this.tag_list = input.tag_list;
      this.permalink = input.permalink;
      this.track_count = input.track_count;
      this.streamable = input.streamable;
      this.downloadable = input.downloadable;
      this.embeddable_by = input.embeddable_by;
      this.purchase_url = input.purchase_url;
      this.label_id = input.label_id;
      this.type = input.type;
      this.playlist_type = input.playlist_type;
      this.ean = input.ean;
      this.description = input.description;
      this.genre = input.genre;
      this.release = input.release;
      this.purchase_title = input.purchase_title;
      this.label_name = input.label_name;
      this.title = input.title;
      this.release_year = input.release_year;
      this.release_month = input.release_month;
      this.release_day = input.release_day;
      this.license = input.license;
      this.uri = input.uri;
      this.permalink_url = input.permalink_url;
      this.artwork_url = input.artwork_url;
      this.user = input.user;
      this.tracks = input.tracks;
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
  public tracks: any[] = [];
}
