import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AppLoginDialog } from 'src/app/components/app-login/app-login.component';
import {
  ISupportedLanguage,
  supportedLanguages,
  TranslateService,
} from 'src/app/modules/translate/index';
import { EventEmitterService } from 'src/app/services/event-emitter/event-emitter.service';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';

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

  constructor(
    private readonly emitter: EventEmitterService,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly translate: TranslateService,
    private readonly firebase: FirebaseService,
  ) {}

  /**
   * Supported languages list.
   */
  public supportedLanguages: ISupportedLanguage[] = [...supportedLanguages];

  /**
   * Selects language by key.
   */
  public selectLanguage(key: string): void {
    this.emitter.emitEvent({ lang: key });
  }

  /**
   * Returns if current language is selected.
   */
  public isLanguageSelected(key: string): boolean {
    return key === this.translate.currentLanguage;
  }

  /**
   * Calls auth dialog.
   */
  public showAuthDialog(): void {
    console.warn('TODO:client show auth dialog');
    const dialogRef: MatDialogRef<AppLoginDialog> = this.dialog.open(AppLoginDialog, {
      data: {},
    });
    dialogRef.afterClosed().subscribe(result => {
      console.warn('AppLoginDialog closed with result', result);
    });
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
