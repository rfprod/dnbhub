export interface ISoundcloudTrackUser {
  id: number;
  permalink: string;
  username: string;
  uri: string;
  permalink_url: string;
  avatar_url: string;
}

export const trackUserDefaultValues: ISoundcloudTrackUser = {
  id: 0,
  permalink: '',
  username: '',
  uri: '',
  permalink_url: '',
  avatar_url: '',
};

export interface ISoundcloudTrack {
  id?: number;
  created_at?: string;
  user_id?: number;
  duration?: number;
  commentable?: boolean;
  state?: string;
  sharing?: string;
  tag_list?: string;
  permalink?: string;
  description?: string;
  streamable?: boolean;
  downloadable?: boolean;
  genre?: string;
  release?: string;
  purchase_url?: string;
  label_id?: number;
  label_name?: string;
  isrc?: string;
  video_url?: string;
  track_type?: string;
  key_signature?: string;
  bpm?: number;
  title?: string;
  release_year?: number;
  release_month?: number;
  release_day?: number;
  original_format?: string;
  original_content_size?: number;
  license?: string;
  uri?: string;
  permalink_url?: string;
  artwork_url?: string;
  waveform_url?: string;
  user?: ISoundcloudTrackUser;
  stream_url?: string;
  download_url?: string;
  playback_count?: number;
  download_count?: number;
  favoritings_count?: number;
  comment_count?: number;
  attachments_uri?: string;
  purchase_title?: string;
}

export const trackDefaultValues: ISoundcloudTrack = {
  id: 0,
  created_at: '',
  user_id: 0,
  duration: 0,
  commentable: false,
  state: '',
  sharing: '',
  tag_list: '',
  permalink: '',
  description: '',
  streamable: false,
  downloadable: false,
  genre: '',
  release: '',
  purchase_url: '',
  label_id: 0,
  label_name: '',
  isrc: '',
  video_url: '',
  track_type: '',
  key_signature: '',
  bpm: 0,
  title: '',
  release_year: 0,
  release_month: 0,
  release_day: 0,
  original_format: '',
  original_content_size: 0,
  license: '',
  uri: '',
  permalink_url: '',
  artwork_url: '',
  waveform_url: '',
  user: { ...trackUserDefaultValues },
  stream_url: '',
  download_url: '',
  playback_count: 0,
  download_count: 0,
  favoritings_count: 0,
  comment_count: 0,
  attachments_uri: '',
  purchase_title: '',
};
