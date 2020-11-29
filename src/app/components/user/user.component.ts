import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngxs/store';
import { combineLatest, of } from 'rxjs';
import { concatMap, filter, mapTo, switchMap } from 'rxjs/operators';
import { DnbhubFirebaseService } from 'src/app/services/firebase/firebase.service';
import { DnbhubSoundcloudService } from 'src/app/state/soundcloud/soundcloud.service';

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

  constructor(
    private readonly store: Store,
    private readonly firebase: DnbhubFirebaseService,
    private readonly soundcloud: DnbhubSoundcloudService,
  ) {
    void combineLatest([this.firebaseUser$, this.userDbRecord$]).subscribe();
  }

  /**
   * Gets user details from Sourndcloud.
   */
  private getUserData(userScId?: number) {
    return this.soundcloud
      .getMe(userScId)
      .pipe(concatMap(me => this.soundcloud.getMyPlaylists(me.id ?? 0).pipe(mapTo(me))));
  }
}
