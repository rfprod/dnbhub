import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Navigate, RouterState } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { first, map, tap } from 'rxjs/operators';
import { DnbhubLoginDialogComponent } from 'src/app/components/login-dialog/login-dialog.component';
import {
  ISupportedLanguage,
  SUPPORTED_LANGUAGE_KEY,
  supportedLanguages,
} from 'src/app/modules/translate/index';
import { firebaseActions } from 'src/app/state/firebase/firebase.actions';
import { DnbhubUiService } from 'src/app/state/ui/ui.service';
import { INxgsRouterState } from 'src/app/utils/ngxs.util';

import { DnbhubFirebaseState } from '../../state/firebase/firebase.store';

@Component({
  selector: 'dnbhub-nav',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DnbhubNavbarComponent {
  public readonly userInfo$ = this.store
    .select(DnbhubFirebaseState.getState)
    .pipe(map(state => state.userRecord));

  public readonly language$ = this.ui.language$;

  public readonly showBackButton$ = this.store.select<INxgsRouterState>(RouterState).pipe(
    map(state => {
      return state.navigationId > 1 && !state.state?.url?.includes('index');
    }),
  );

  public readonly privilegedAccess$ = this.store.select(DnbhubFirebaseState.privilegedAccess);

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly ui: DnbhubUiService,
    private readonly location: Location,
  ) {}

  public supportedLanguages: ISupportedLanguage[] = [...supportedLanguages];

  public goBack(): void {
    void this.store
      .select(RouterState.state)
      .pipe(
        first(),
        tap(state => {
          const hasQueryParams = state?.url?.match(/.*[?].*/);
          if (
            typeof hasQueryParams !== 'undefined' &&
            hasQueryParams !== null &&
            hasQueryParams.length > 0
          ) {
            this.location.back();
            this.location.back();
          } else {
            this.location.back();
          }
        }),
      )
      .subscribe();
  }

  public selectLanguage(key: SUPPORTED_LANGUAGE_KEY = SUPPORTED_LANGUAGE_KEY.ENGLISH): void {
    void this.ui.selectLanguage(key).subscribe();
  }

  public showAuthDialog(): void {
    this.dialog.open(DnbhubLoginDialogComponent);
  }

  public logout(): void {
    void this.store.dispatch(new firebaseActions.setState({ userRecord: null, userInfo: null }));
    void this.store.dispatch(new firebaseActions.signOut()).subscribe();
    void this.store.dispatch(new Navigate(['/index']));
  }
}
