import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IDnbhubUserStateModel } from 'src/app/state/user/user.interface';

import { ISoundcloudPlaylist } from '../../interfaces/soundcloud/soundcloud-playlist.config';

@Component({
  selector: 'dnbhub-user-playlist-actions',
  templateUrl: './user-playlist-actions.component.html',
  styleUrls: ['./user-playlist-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DnbhubUserPlaylistActionsComponent {
  @Input() public playlist?: ISoundcloudPlaylist;

  @Input() public dnbhubUser: IDnbhubUserStateModel | null = null;

  @Output() public readonly submitPlaylist = new EventEmitter<ISoundcloudPlaylist>();

  @Output() public readonly unsubmitPlaylist = new EventEmitter<ISoundcloudPlaylist>();

  @Output() public readonly previewPlaylist = new EventEmitter<ISoundcloudPlaylist>();

  /**
   * Resolves if a playlist is already added.
   */
  public get alreadyAdded() {
    return (
      typeof this.dnbhubUser?.firebaseUser?.submittedPlaylists[this.playlist?.id ?? -1] ===
      'boolean'
    );
  }

  /**
   * Resolves if a playlist is already submitted.
   */
  public get alreadySubmitted() {
    return Boolean(this.dnbhubUser?.firebaseUser?.submittedPlaylists[this.playlist?.id ?? -1])
      ? true
      : false;
  }

  public submit() {
    this.submitPlaylist.next(this.playlist);
  }

  public unsubmit() {
    this.unsubmitPlaylist.next(this.playlist);
  }

  public preview() {
    this.previewPlaylist.next(this.playlist);
  }
}