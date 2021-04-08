import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';
import { concatMap, filter, mapTo } from 'rxjs/operators';
import { DnbhubSoundcloudService } from 'src/app/state/soundcloud/soundcloud.service';

import { DnbhubFirebaseState } from '../../state/firebase/firebase.store';
import { DnbhubUserState } from '../../state/user/user.store';

@UntilDestroy()
@Component({
  selector: 'dnbhub-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DnbhubUserComponent {
  public readonly me$ = this.soundcloud.me$;

  public readonly myPlaylists$ = this.soundcloud.myPlaylists$;

  public readonly firebaseUser$ = this.store.select(DnbhubFirebaseState.userInfo);

  public readonly userDbRecord$ = this.store.select(DnbhubUserState.firebaseUser).pipe(
    untilDestroyed(this),
    filter(user => user !== null && typeof user !== 'undefined'),
    concatMap(userRecord => {
      if (userRecord !== null && typeof userRecord !== 'undefined') {
        return this.soundcloud
          .getMe(userRecord.sc_id)
          .pipe(
            concatMap(me => this.soundcloud.getMyPlaylists(me.id ?? 0).pipe(mapTo(userRecord))),
          );
      }
      return of(userRecord);
    }),
  );

  public readonly dnbhubUser$ = this.store.select(DnbhubUserState.getState);

  constructor(
    private readonly store: Store,
    private readonly soundcloud: DnbhubSoundcloudService,
  ) {}
}
