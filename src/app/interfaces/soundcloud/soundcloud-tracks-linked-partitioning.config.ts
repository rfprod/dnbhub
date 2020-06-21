/* eslint-disable @typescript-eslint/naming-convention */

import { SoundcloudTrack } from './soundcloud-track.config';

/**
 * Soundcloud tracks collection with linked partitioning interface.
 * API Documentation https://developers.soundcloud.com/docs/api/reference#tracks
 */
export class SoundcloudTracksLinkedPartitioning {
  constructor(collection: SoundcloudTrack[] = [], nextHref = '') {
    this.collection = collection;
    this.next_href = nextHref;
  }

  public collection: SoundcloudTrack[];

  public next_href: string;
}
