import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';
import { concatMap, filter, mapTo } from 'rxjs/operators';

import { DnbhubFirebaseState } from '../../state/firebase/firebase.store';
import { DnbhubSoundcloudService } from '../../state/soundcloud/soundcloud.service';

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

  public readonly userRecord$ = this.store.select(DnbhubFirebaseState.userRecord).pipe(
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

  constructor(
    private readonly store: Store,
    private readonly soundcloud: DnbhubSoundcloudService,
  ) {}
}
