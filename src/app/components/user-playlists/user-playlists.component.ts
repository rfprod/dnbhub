import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { first, switchMap, tap } from 'rxjs/operators';
import { IFirebaseUserRecord } from 'src/app/interfaces/firebase';
import { ISoundcloudPlaylist } from 'src/app/interfaces/index';
import { DnbhubFirebaseService } from 'src/app/state/firebase/firebase.service';
import { TIMEOUT } from 'src/app/utils';

import { IFirebaseUserSubmittedPlaylists } from '../../interfaces/firebase/firebase-user.interface';
import { IDnbhubUserStateModel } from '../../state/user/user.interface';

@Component({
  selector: 'dnbhub-user-playlists',
  templateUrl: './user-playlists.component.html',
  styleUrls: ['./user-playlists.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DnbhubUserPlaylistsComponent {
  @Input() public playlists: ISoundcloudPlaylist[] | null = null;

  @Input() public firebaseUser: firebase.default.User | null = null;

  @Input() public dnbhubUser: IDnbhubUserStateModel | null = null;

  constructor(
    private readonly firebase: DnbhubFirebaseService,
    private readonly snackBar: MatSnackBar,
  ) {}

  private displayMessage(message: string): void {
    this.snackBar.open(message, void 0, {
      duration: TIMEOUT.SHORT,
    });
  }

  public submitPlaylist(playlist: ISoundcloudPlaylist): void {
    void this.firebase
      .getListItem<IFirebaseUserRecord>(`users/${this.firebaseUser?.uid ?? ''}`)
      .valueChanges()
      .pipe(
        first(),
        switchMap(userDbRecord => {
          if (userDbRecord !== null) {
            /**
             * false - submitted but not approved by a moderator;
             * true - submitted and approved by a moderator;
             */
            userDbRecord.submittedPlaylists[playlist.id] = false;
            return this.firebase
              .setDBuserNewValues({ submittedPlaylists: userDbRecord.submittedPlaylists })
              .pipe(
                tap(() => {
                  const message = `Playlist ${playlist.title} was successfully submitted.`;
                  this.displayMessage(message);
                }),
              );
          }
          return of(null);
        }),
      )
      .subscribe();
  }

  public unsubmitPlaylist(playlist: ISoundcloudPlaylist): void {
    void this.firebase
      .getListItem<IFirebaseUserRecord>(`users/${this.firebaseUser?.uid ?? ''}`)
      .valueChanges()
      .pipe(
        first(),
        switchMap(userRecord => {
          if (userRecord !== null) {
            const playlists = userRecord.submittedPlaylists;
            const unsubmitPlaylistId = playlist.id.toString();

            if (!Boolean(playlists)) {
              const message = 'No playlists to unsubmit.';
              this.displayMessage(message);
              return throwError(new Error(message));
            } else if (!playlists[unsubmitPlaylistId]) {
              const userDbRecord = userRecord;
              const playListKeys = Object.keys(playlists);
              const submittedPlaylists: IFirebaseUserSubmittedPlaylists = {};

              for (const key of playListKeys) {
                if (key !== unsubmitPlaylistId) {
                  submittedPlaylists[key] = playlists[key];
                }
              }
              userDbRecord.submittedPlaylists = { ...submittedPlaylists };

              return this.firebase.setDBuserNewValues({ submittedPlaylists }).pipe(
                tap(() => {
                  const message = `Playlist ${playlist.title} was successfully unsubmitted.`;
                  this.displayMessage(message);
                }),
              );
            }

            return throwError(new Error('Playlist is no unsubmittable.'));
          }
          return throwError(new Error('User does not exist.'));
        }),
      )
      .subscribe();
  }

  public previewPlaylist(playlist: ISoundcloudPlaylist): void {
    /**
     * @note TODO: add preview playlist logic
     */
  }
}
