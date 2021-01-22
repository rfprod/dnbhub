import { ISoundcloudTrack } from './soundcloud-track.config';

/**
 * Soundcloud tracks collection with linked partitioning interface.
 * API Documentation https://developers.soundcloud.com/docs/api/reference#tracks
 */
export interface ISoundcloudTracksLinkedPartitioning {
  collection: ISoundcloudTrack[];
  next_href: string;
}

export const linkedPartitioningDefaultValues: ISoundcloudTracksLinkedPartitioning = {
  collection: [],
  next_href: '',
};
