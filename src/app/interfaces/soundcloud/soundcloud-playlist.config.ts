import { ISoundcloudTrack } from './soundcloud-track.config';

export interface ISoundcloudPlaylistUser {
  id: number;
  kind: string;
  permalink: string;
  username: string;
  uri: string;
  permalink_url: string;
  avatar_url: string;
}

/**
 * Soundcloud playlist interface.
 * API Documentation https://developers.soundcloud.com/docs/api/reference#playlists
 */
export interface ISoundcloudPlaylist {
  kind: string;
  id: number;
  created_at: string;
  user_id: number;
  duration: number;
  sharing: string;
  tag_list: string;
  permalink: string;
  track_count: number;
  streamable: boolean;
  downloadable: boolean;
  embeddable_by: string;
  purchase_url: string | null;
  label_id: string | null;
  type: string;
  playlist_type: string;
  ean: string;
  description: string;
  genre: string;
  release: string;
  purchase_title: string | null;
  label_name: string;
  title: string;
  release_year: string | number | null;
  release_month: string | number | null;
  release_day: string | number | null;
  license: string;
  uri: string;
  permalink_url: string;
  artwork_url: string;
  user: ISoundcloudPlaylistUser;
  tracks: ISoundcloudTrack[];
}

export const playlistDefaultValues: ISoundcloudPlaylist = {
  kind: '',
  id: 0,
  created_at: '',
  user_id: 0,
  duration: 0,
  sharing: '',
  tag_list: '',
  permalink: '',
  track_count: 0,
  streamable: false,
  downloadable: false,
  embeddable_by: '',
  purchase_url: null,
  label_id: null,
  type: '',
  playlist_type: '',
  ean: '',
  description: '',
  genre: '',
  release: '',
  purchase_title: null,
  label_name: '',
  title: '',
  release_year: null,
  release_month: null,
  release_day: null,
  license: '',
  uri: '',
  permalink_url: '',
  artwork_url: '',
  user: {
    id: 0,
    kind: '',
    permalink: '',
    username: '',
    uri: '',
    permalink_url: '',
    avatar_url: '',
  },
  tracks: [],
};
