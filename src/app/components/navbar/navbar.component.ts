import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterState } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';
import { DnbhubLoginDialogComponent } from 'src/app/components/login-dialog/login-dialog.component';
import {
  ESUPPORTED_LANGUAGE_KEY,
  ISupportedLanguage,
  supportedLanguages,
} from 'src/app/modules/translate/index';
import { DnbhubFirebaseService } from 'src/app/services/firebase/firebase.service';
import { DnbhubUiService } from 'src/app/state/ui/ui.service';
import { INxgsRouterState } from 'src/app/utils/ngxs.util';

/**
 * Application navigation component.
 */
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'dnbhub-nav',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class DnbhubNavbarComponent {
  public readonly anonUser$ = this.firebase.anonUser$;

  public readonly language$ = this.ui.language$;

  public readonly showBackButton$ = this.store.select<INxgsRouterState>(RouterState).pipe(
    map(state => {
      return state.navigationId > 1 && !state.state?.url?.includes('index');
    }),
  );

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
  public selectLanguage(key: ESUPPORTED_LANGUAGE_KEY): void {
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

  /**
   * Indicates if user had admin role.
   */
  public isAdmin(): boolean {
    return this.firebase.privilegedAccess();
  }
}
