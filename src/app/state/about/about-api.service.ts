import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AboutDetails } from 'src/app/interfaces/about/about-details.interface';
import { FirebaseService } from 'src/app/services';
import { HttpHandlersService } from 'src/app/services/http-handlers/http-handlers.service';

import { aboutActions } from './about.store';

/**
 * About API service.
 */
@Injectable({
  providedIn: 'root',
})
export class AboutApiService implements OnDestroy {
  constructor(
    private readonly handlers: HttpHandlersService,
    private readonly firebase: FirebaseService,
    private readonly store: Store,
  ) {}

  public getDetails() {
    const promise = (this.firebase.getDB('about', true) as firebase.database.Reference)
      .once('value')
      .then(snapshot => {
        const response: AboutDetails = snapshot.val();
        return response;
      });
    return this.handlers.pipeHttpRequest(from(promise)).pipe(
      tap(details => {
        this.store.dispatch(new aboutActions.setAboutState({ details }));
      }),
    );
  }

  public ngOnDestroy() {
    (this.firebase.getDB('about', true) as firebase.database.Reference).off();
  }
}
