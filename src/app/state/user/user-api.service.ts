import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { from, of } from 'rxjs';
import { filter, first, map, tap } from 'rxjs/operators';

import { IFirebaseUserRecord } from '../../interfaces/firebase';
import { DnbhubFirebaseService } from '../../services/firebase/firebase.service';
import { DnbhubHttpHandlersService } from '../../services/http-handlers/http-handlers.service';
import { httpProgressActions } from '../http-progress/http-progress.store';
import { toasterActions } from '../toaster/toaster.store';

@Injectable({
  providedIn: 'root',
})
export class DnbhubUserApiService {
  constructor(
    private readonly store: Store,
    private readonly handlers: DnbhubHttpHandlersService,
    private readonly firebase: DnbhubFirebaseService,
  ) {}

  public getUserRecord(id: string) {
    const observable = this.firebase
      .getListItem<IFirebaseUserRecord>(`users/${id}`)
      .valueChanges()
      .pipe(
        filter(user => user !== null),
        first(),
        map(user => user as IFirebaseUserRecord),
      );
    return this.handlers.pipeHttpRequest<IFirebaseUserRecord>(observable);
  }

  public updateProfile(options: { displayName: string }) {
    const firebaseUser = this.firebase.fire.user;
    if (firebaseUser !== null) {
      void this.store.dispatch(new httpProgressActions.startProgress({ mainView: true }));
      const observable = from(firebaseUser.updateProfile({ displayName: options.displayName }));
      return this.handlers.pipeHttpRequest<void>(observable).pipe(
        tap(
          () => {
            void this.store.dispatch(
              new toasterActions.showToaster({
                show: true,
                message: 'Your profile was updated.',
                type: 'success',
              }),
            );
          },
          (error: Error) => {
            void this.store.dispatch(
              new toasterActions.showToaster({ show: true, message: error.message, type: 'error' }),
            );
          },
          () => {
            void this.store.dispatch(new httpProgressActions.startProgress({ mainView: false }));
          },
        ),
      );
    }
    return of<void>();
  }
}
