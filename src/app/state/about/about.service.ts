import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import { DnbhubAboutApiService } from './about-api.service';
import { IDnbhubAboutService } from './about.interface';
import { aboutActions, DnbhubAboutState } from './about.store';

@Injectable({
  providedIn: 'root',
})
export class DnbhubAboutService implements IDnbhubAboutService {
  constructor(private readonly store: Store, private readonly api: DnbhubAboutApiService) {}

  public readonly details$ = this.store.select(DnbhubAboutState.getDetails);

  public getDetails() {
    return this.api.getDetails().pipe(
      tap(details => {
        void this.store.dispatch(new aboutActions.setDnbhubAboutState({ details }));
      }),
    );
  }
}
