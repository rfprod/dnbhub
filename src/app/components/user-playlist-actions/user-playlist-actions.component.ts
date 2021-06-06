import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { IFirebaseUserRecord } from '../../interfaces/firebase/firebase-user.interface';
import { ISoundcloudPlaylist } from '../../interfaces/soundcloud/soundcloud-playlist.config';

@Component({
  selector: 'dnbhub-user-playlist-actions',
  templateUrl: './user-playlist-actions.component.html',
  styleUrls: ['./user-playlist-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DnbhubUserPlaylistActionsComponent {
  @Input() public playlist?: ISoundcloudPlaylist;

  @Input() public userRecord?: IFirebaseUserRecord | null = null;

  @Output() public readonly submitPlaylist = new EventEmitter<ISoundcloudPlaylist>();

  @Output() public readonly unsubmitPlaylist = new EventEmitter<ISoundcloudPlaylist>();

  @Output() public readonly previewPlaylist = new EventEmitter<ISoundcloudPlaylist>();

  /**
   * Resolves if a playlist is already added.
   */
  public get alreadyAdded() {
    return typeof this.userRecord?.submittedPlaylists[this.playlist?.id ?? -1] === 'boolean';
  }

  /**
   * Resolves if a playlist is already submitted.
   */
  public get alreadySubmitted() {
    return Boolean(this.userRecord?.submittedPlaylists[this.playlist?.id ?? -1]) ? true : false;
  }

  public submit() {
    if (typeof this.playlist !== 'undefined') {
      this.submitPlaylist.next(this.playlist);
    }
  }

  public unsubmit() {
    if (typeof this.playlist !== 'undefined') {
      this.unsubmitPlaylist.next(this.playlist);
    }
  }

  public preview() {
    if (typeof this.playlist !== 'undefined') {
      this.previewPlaylist.next(this.playlist);
    }
  }
}
