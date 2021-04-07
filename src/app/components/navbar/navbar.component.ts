import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterState } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';
import { DnbhubLoginDialogComponent } from 'src/app/components/login-dialog/login-dialog.component';
import {
  ISupportedLanguage,
  SUPPORTED_LANGUAGE_KEY,
  supportedLanguages,
} from 'src/app/modules/translate/index';
import { DnbhubFirebaseService } from 'src/app/state/firebase/firebase.service';
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
  public readonly anonUser$ = this.store
    .select(DnbhubFirebaseState.getState)
    .pipe(map(state => !Boolean(state.user)));

  public readonly language$ = this.ui.language$;

  public readonly showBackButton$ = this.store.select<INxgsRouterState>(RouterState).pipe(
    map(state => {
      return state.navigationId > 1 && !state.state?.url?.includes('index');
    }),
  );

  public readonly privilegedAccess$ = this.store.select(DnbhubFirebaseState.privilegedAccess);

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly firebase: DnbhubFirebaseService,
    private readonly ui: DnbhubUiService,
    private readonly location: Location,
  ) {}

  /**
   * Supported languages list.
   */
  public supportedLanguages: ISupportedLanguage[] = [...supportedLanguages];

  /**
   * Navigates user back.
   */
  public goBack(): void {
    this.location.back();
  }

  /**
   * Selects language.
   */
  public selectLanguage(key: SUPPORTED_LANGUAGE_KEY = SUPPORTED_LANGUAGE_KEY.ENGLISH): void {
    void this.ui.selectLanguage(key).subscribe();
  }

  /**
   * Calls auth dialog.
   */
  public showAuthDialog(): void {
    this.dialog.open(DnbhubLoginDialogComponent);
  }

  /**
   * Signs user out.
   */
  public logout(): void {
    void this.firebase
      .signout()
      .pipe(
        tap(() => {
          void this.router.navigate(['/index']);
        }),
      )
      .subscribe();
  }
}
