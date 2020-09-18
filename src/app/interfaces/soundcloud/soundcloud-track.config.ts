/* eslint-disable @typescript-eslint/naming-convention */

export interface ISoundcloudTrackUser {
  id: number;
  permalink: string;
  username: string;
  uri: string;
  permalink_url: string;
  avatar_url: string;
}

export class SoundcloudTrack {
  constructor(input?: SoundcloudTrack) {
    if (typeof input !== 'undefined') {
      const keys = Object.keys(input);
      for (const key of keys) {
        this[key] = input[key];
      }
    }
  }

  public id?: number;

  public created_at?: string;

  public user_id?: number;

  public duration?: number;

  public commentable?: boolean;

  public state?: string;

  public sharing?: string;

  public tag_list?: string;

  public permalink?: string;

  public description?: string;

  public streamable?: boolean;

  public downloadable?: boolean;

  public genre?: string;

  public release?: string;

  public purchase_url?: string;

  public label_id?: number;

  public label_name?: string;

  public isrc?: string;

  public video_url?: string;

  public track_type?: string;

  public key_signature?: string;

  public bpm?: number;

  public title?: string;

  public release_year?: number;

  public release_month?: number;

  public release_day?: number;

  public original_format?: string;

  public original_content_size?: number;

  public license?: string;

  public uri?: string;

  public permalink_url?: string;

  public artwork_url?: string;

  public waveform_url?: string;

  public user?: ISoundcloudTrackUser;

  public stream_url?: string;

  public download_url?: string;

  public playback_count?: number;

  public download_count?: number;

  public favoritings_count?: number;

  public comment_count?: number;

  public attachments_uri?: string;

  public purchase_title?: string;
}
