/**
 * Soundcloud tracks collection with linked partitioning interface.
 * API Documentation https://developers.soundcloud.com/docs/api/reference#tracks
 */
export class ISoundcloudTracksLinkedPartitioning {
  public collection: any[] = [];
  public next_href: string;
}
