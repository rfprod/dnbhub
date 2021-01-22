import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngxs/store';
import { of, throwError } from 'rxjs';
import { first, map, switchMap, tap } from 'rxjs/operators';
import { IFirebaseUserRecord } from 'src/app/interfaces/firebase';
import { ISoundcloudPlaylist } from 'src/app/interfaces/index';
import { DnbhubFirebaseService } from 'src/app/services/firebase/firebase.service';
import { TIMEOUT } from 'src/app/utils';

import { IFirebaseUserSubmittedPlaylists } from '../../interfaces/firebase/firebase-user.interface';
import { DnbhubUserState } from '../../state/user/user.store';

@Component({
  selector: 'dnbhub-user-playlists',
  templateUrl: './user-playlists.component.html',
  styleUrls: ['./user-playlists.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DnbhubUserPlaylistsComponent {
  @Input() public myPlaylists: ISoundcloudPlaylist[] | null = null;

  @Input() public firebaseUser: firebase.default.User | null = null;

  constructor(
    private readonly store: Store,
    private readonly firebase: DnbhubFirebaseService,
    private readonly snackBar: MatSnackBar,
  ) {}

  private displayMessage(message: string): void {
    this.snackBar.open(message, void 0, {
      duration: TIMEOUT.SHORT,
    });
  }

  /**
   * Resolves if a playlist is already added.
   * @note TODO: refactor, such streams do not work as expected
   */
  public readonly alreadyAdded$ = (playlist: ISoundcloudPlaylist) => {
    return this.store.selectOnce(DnbhubUserState.getState).pipe(
      map(user => {
        return typeof user.firebaseUser?.submittedPlaylists[playlist.id] === 'boolean';
      }),
    );
  };

  /**
   * Resolves if a playlist is already submitted.
   * @note TODO: refactor, such streams do not work as expected
   */
  public readonly alreadySubmitted$ = (playlist: ISoundcloudPlaylist) =>
    this.store.selectOnce(DnbhubUserState.getState).pipe(
      map(user => {
        return (user.firebaseUser?.submittedPlaylists ?? {})[playlist.id] ? true : false;
      }),
    );

  /**
   * Resolves if track is unsubmittable.
   * @param index playlist array index
   * @note TODO: refactor, such streams do not work as expected
   */
  public readonly unsubmittable$ = (playlist: ISoundcloudPlaylist) =>
    this.firebase
      .getListItem<IFirebaseUserRecord>(`users/${this.firebaseUser?.uid ?? ''}`)
      .valueChanges()
      .pipe(
        map(userRecord => {
          if (userRecord !== null) {
            if (Boolean(userRecord.submittedPlaylists)) {
              return !Boolean(userRecord.submittedPlaylists[playlist.id]) ? true : false;
            }
          }
          return false;
        }),
      );

  /**
   * Unsubmits blog post.
   * @param index playlist array index
   */
  public unsubmitBlogPost(playlist: ISoundcloudPlaylist): void {
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

  /**
   * Submits blog post.
   * @param index playlist array index
   */
  public submitBlogPost(playlist: ISoundcloudPlaylist): void {
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
}
