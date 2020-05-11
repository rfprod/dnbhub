import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import { AboutApiService } from './about-api.service';
import { IAboutService } from './about.interface';
import { aboutActions, AboutState } from './about.store';

@Injectable({
  providedIn: 'root',
})
export class AboutService implements IAboutService {
  constructor(private readonly store: Store, private readonly api: AboutApiService) {}

  public readonly details$ = this.store.select(AboutState.getDetails);

  public getDetails() {
    return this.api.getDetails().pipe(
      tap(details => {
        this.store.dispatch(new aboutActions.setAboutState({ details }));
      }),
    );
  }
}
