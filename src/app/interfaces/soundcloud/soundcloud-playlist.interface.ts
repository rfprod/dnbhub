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

  public kind: string = '';
  public id: number = 0;
  public created_at: string  = '';
  public user_id: number  = 0;
  public duration: number  = 0;
  public sharing: string = '';
  public tag_list: string = '';
  public permalink: string = '';
  public track_count: number = 0;
  public streamable: boolean = false;
  public downloadable: boolean = false;
  public embeddable_by: string  = '';
  public purchase_url: string|null = null;
  public label_id: string|null = null;
  public type: string  = '';
  public playlist_type: string = '';
  public ean: string = '';
  public description: string = '';
  public genre: string = '';
  public release: string = '';
  public purchase_title: string|null = null;
  public label_name: string = '';
  public title: string = '';
  public release_year: string|number|null = null;
  public release_month: string|number|null = null;
  public release_day: string|number|null = null;
  public license: string = '';
  public uri: string = '';
  public permalink_url: string = '';
  public artwork_url: string = '';
  public user: {
    id: number,
    kind: string,
    permalink: string,
    username: string,
    uri: string,
    permalink_url: string,
    avatar_url: string
  } = {
    id: 0,
    kind: '',
    permalink: '',
    username: '',
    uri: '',
    permalink_url: '',
    avatar_url: ''
  };
  public tracks: any[] = [];
}
