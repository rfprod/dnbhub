import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { first, map, tap } from 'rxjs/operators';

import { DnbhubAboutDetails } from '../../interfaces/about/about-details.interface';
import { DnbhubHttpHandlersService } from '../../services/http-handlers/http-handlers.service';
import { DnbhubFirebaseService } from '../../state/firebase/firebase.service';
import { aboutActions } from './about.actions';

@Injectable({
  providedIn: 'root',
})
export class DnbhubAboutApiService {
  constructor(
    private readonly handlers: DnbhubHttpHandlersService,
    private readonly firebase: DnbhubFirebaseService,
    private readonly store: Store,
  ) {}

  public getDetails() {
    const observable = this.firebase
      .getListItem<DnbhubAboutDetails>('about')
      .valueChanges()
      .pipe(
        first(),
        map(data => (data === null ? void 0 : data)),
      );
    return this.handlers.pipeHttpRequest(observable).pipe(
      tap(details => {
        void this.store.dispatch(new aboutActions.setDnbhubAboutState({ details }));
      }),
    );
  }
}
