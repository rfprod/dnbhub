import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { map } from 'rxjs/operators';

import { DnbhubFirebaseState } from '../../state/firebase/firebase.store';

@Injectable({
  providedIn: 'root',
})
export class DnbhubAuthenticatedGuard implements CanActivate {
  constructor(private readonly router: Router, private readonly store: Store) {}

  public canActivate() {
    return this.store.selectOnce(DnbhubFirebaseState.getState).pipe(
      map(state => {
        if (state.userInfo !== null) {
          return true;
        }
        return this.router.createUrlTree(['/index']);
      }),
    );
  }
}
