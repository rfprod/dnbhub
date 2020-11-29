import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngxs/store';
import { combineLatest, of, throwError } from 'rxjs';
import { concatMap, filter, first, map, mapTo, switchMap, tap } from 'rxjs/operators';
import { IFirebaseUserRecord } from 'src/app/interfaces/firebase';
import { SoundcloudPlaylist } from 'src/app/interfaces/index';
import { DnbhubFirebaseService } from 'src/app/services/firebase/firebase.service';
import { DnbhubSoundcloudService } from 'src/app/state/soundcloud/soundcloud.service';
import { TIMEOUT } from 'src/app/utils';

import { IFirebaseUserSubmittedPlaylists } from '../../interfaces/firebase/firebase-user.interface';
import { DnbhubUserState, userActions } from '../../state/user/user.store';

@UntilDestroy()
@Component({
  selector: 'dnbhub-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DnbhubUserComponent {
  public readonly anonUser$ = this.firebase.anonUser$;

  public readonly me$ = this.soundcloud.me$;

  public readonly myPlaylists$ = this.soundcloud.myPlaylists$;

  public readonly firebaseUser = this.firebase.fire.user;

  private readonly firebaseUser$ = this.firebase.user$.pipe(
    untilDestroyed(this),
    switchMap(user => this.store.dispatch(new userActions.getUserRecord({ id: user?.uid ?? '' }))),
  );

  public readonly userDbRecord$ = this.store.select(DnbhubUserState.firebaseUser).pipe(
    untilDestroyed(this),
    filter(user => user !== null && typeof user !== 'undefined'),
    concatMap(userRecord => {
      if (userRecord !== null && typeof userRecord !== 'undefined') {
        return this.getUserData(userRecord.sc_id).pipe(mapTo(userRecord));
      }
      return of(userRecord);
    }),
  );

  public submissionPreview: SoundcloudPlaylist | null = null;

  constructor(
    private readonly store: Store,
    private readonly firebase: DnbhubFirebaseService,
    private readonly soundcloud: DnbhubSoundcloudService,
    private readonly snackBar: MatSnackBar,
  ) {
    void combineLatest([this.firebaseUser$, this.userDbRecord$]).subscribe();
  }

  private displayMessage(message: string): void {
    this.snackBar.open(message, void 0, {
      duration: TIMEOUT.SHORT,
    });
  }

  /**
   * Gets user details from Sourndcloud.
   */
  private getUserData(userScId?: number) {
    return this.soundcloud
      .getMe(userScId)
      .pipe(concatMap(me => this.soundcloud.getMyPlaylists(me.id ?? 0).pipe(mapTo(me))));
  }

  /**
   * Tobbles blog post preview.
   */
  public toggleBlogPostPreview(playlist?: SoundcloudPlaylist): void {
    this.submissionPreview = Boolean(this.submissionPreview)
      ? null
      : typeof playlist !== 'undefined'
      ? playlist
      : null;
  }

  /**
   * Resolves if a playlist is already added.
   */
  public readonly alreadyAdded$ = (playlist: SoundcloudPlaylist) => {
    return this.store.selectOnce(DnbhubUserState.getState).pipe(
      map(user => {
        return typeof user.firebaseUser?.submittedPlaylists[playlist.id] === 'boolean';
      }),
    );
  };

  /**
   * Resolves if a playlist is already submitted.
   */
  public readonly alreadySubmitted$ = (playlist: SoundcloudPlaylist) =>
    this.store.selectOnce(DnbhubUserState.getState).pipe(
      map(user => {
        return (user.firebaseUser?.submittedPlaylists ?? {})[playlist.id] ? true : false;
      }),
    );

  /**
   * Resolves if track is unsubmittable.
   * @param index playlist array index
   */
  public readonly unsubmittable$ = (playlist: SoundcloudPlaylist) =>
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
  public unsubmitBlogPost(playlist: SoundcloudPlaylist): void {
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
            } else if (playlists[unsubmitPlaylistId] === false) {
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
  public submitBlogPost(playlist: SoundcloudPlaylist): void {
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
