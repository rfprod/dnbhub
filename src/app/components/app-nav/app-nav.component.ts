import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AppLoginDialog } from 'src/app/components/app-login/app-login.component';
import {
  ESUPPORTED_LANGUAGE_KEY,
  ISupportedLanguage,
  supportedLanguages,
} from 'src/app/modules/translate/index';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { UiService } from 'src/app/state/ui/ui.service';

/**
 * Application navigation component.
 */
@Component({
  selector: 'app-nav',
  templateUrl: './app-nav.component.html',
  styleUrls: ['./app-nav.component.scss'],
  host: {
    class: 'mat-body-1',
  },
})
export class AppNavComponent {
  public readonly anonUser$ = this.firebase.anonUser$;

  public readonly language$ = this.ui.language$;

  constructor(
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly firebase: FirebaseService,
    private readonly ui: UiService,
  ) {}

  /**
   * Supported languages list.
   */
  public supportedLanguages: ISupportedLanguage[] = [...supportedLanguages];

  /**
   * Selects language.
   */
  public selectLanguage(key: ESUPPORTED_LANGUAGE_KEY): void {
    this.ui.selectLanguage(key).subscribe();
  }

  /**
   * Calls auth dialog.
   */
  public showAuthDialog(): void {
    this.dialog.open(AppLoginDialog);
  }

  /**
   * Signs user out.
   */
  public logout(): void {
    this.firebase
      .signout()
      .pipe(
        tap(_ => {
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
