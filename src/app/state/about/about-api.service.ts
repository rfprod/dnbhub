import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DnbhubAboutDetails } from 'src/app/interfaces/about/about-details.interface';
import { DnbhubFirebaseService } from 'src/app/services/firebase/firebase.service';
import { DnbhubHttpHandlersService } from 'src/app/services/http-handlers/http-handlers.service';

import { aboutActions } from './about.store';

/**
 * About API service.
 */
@Injectable({
  providedIn: 'root',
})
export class DnbhubAboutApiService implements OnDestroy {
  constructor(
    private readonly handlers: DnbhubHttpHandlersService,
    private readonly firebase: DnbhubFirebaseService,
    private readonly store: Store,
  ) {}

  public getDetails() {
    const promise = this.firebase
      .getDB('about')
      .once('value')
      .then(snapshot => {
        const response: DnbhubAboutDetails = snapshot.val();
        return response;
      });
    return this.handlers.pipeHttpRequest(from(promise)).pipe(
      tap(details => {
        void this.store.dispatch(new aboutActions.setDnbhubAboutState({ details }));
      }),
    );
  }

  public ngOnDestroy() {
    this.firebase.getDB('about').off();
  }
}
