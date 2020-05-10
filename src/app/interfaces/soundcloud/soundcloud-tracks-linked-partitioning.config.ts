/* eslint-disable @typescript-eslint/naming-convention */

import { SoundcloudTrack } from './soundcloud-track.config';

/**
 * Soundcloud tracks collection with linked partitioning interface.
 * API Documentation https://developers.soundcloud.com/docs/api/reference#tracks
 */
export class SoundcloudTracksLinkedPartitioning {
  public collection: SoundcloudTrack[] = [];
  public next_href = '';
}
