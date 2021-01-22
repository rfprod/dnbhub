export interface ISoundcloudMe {
  id?: number;
  permalink?: string;
  username?: string;
  uri?: string;
  permalink_url?: string;
  avatar_url?: string;
  country?: string;
  full_name?: string;
  city?: string;
  description?: string;
  discogs_name?: string;
  myspace_name?: string;
  website?: string;
  website_title?: string;
  online?: boolean;
  track_count?: number;
  playlist_count?: number;
  followers_count?: number;
  followings_count?: number;
  public_favorites_count?: number;
  plan?: string;
  private_tracks_count?: number;
  private_playlists_count?: number;
  primary_email_confirmed?: boolean;
}

export const meDefaultValues: ISoundcloudMe = {
  id: 0,
  permalink: '',
  username: '',
  uri: '',
  permalink_url: '',
  avatar_url: '',
  country: '',
  full_name: '',
  city: '',
  description: '',
  discogs_name: '',
  myspace_name: '',
  website: '',
  website_title: '',
  online: false,
  track_count: 0,
  playlist_count: 0,
  followers_count: 0,
  followings_count: 0,
  public_favorites_count: 0,
  plan: '',
  private_tracks_count: 0,
  private_playlists_count: 0,
  primary_email_confirmed: false,
};
