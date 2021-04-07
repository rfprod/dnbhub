import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { DnbhubFirebaseState } from '../../state/firebase/firebase.store';

/**
 * Authenticated guard.
 * Passes authenticated users only.
 */
@Injectable({
  providedIn: 'root',
})
export class DnbhubAuthenticatedGuard implements CanActivate {
  constructor(private readonly router: Router, private readonly store: Store) {}

  public canActivate(): Observable<boolean> {
    return this.store.selectOnce(DnbhubFirebaseState.getState).pipe(
      map(state => Boolean(state.user)),
      tap(user => {
        if (!user) {
          void this.router.navigate(['index']);
        }
      }),
    );
  }
}
