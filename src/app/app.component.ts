import { Component, Inject, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { DateAdapter } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AppContactDialog } from 'src/app/components/app-contact/app-contact.component';
import {
  ISupportedLanguage,
  supportedLanguages,
  TranslateService,
} from 'src/app/modules/translate/index';
import { EventEmitterService } from 'src/app/services/event-emitter/event-emitter.service';

import { UiService } from './state/ui/ui.service';
import { UiState } from './state/ui/ui.store';
import { WINDOW } from './utils';

/**
 * Application root component.
 */
@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @Select(UiState.getSidenavOpened)
  public readonly sidenavOpened$: Observable<boolean>;

  /**
   * Sidenav grid configuration object.
   */
  public gridConfig: { cols: string; rowHeight: string } = {
    cols: '3',
    rowHeight: '1:1',
  };

  /**
   * Reusable modal dialog instance.
   */
  private dialogInstance: MatDialogRef<AppContactDialog>;

  constructor(
    private readonly matIconRegistry: MatIconRegistry,
    private readonly dateAdapter: DateAdapter<Date>,
    private readonly dialog: MatDialog,
    private readonly domSanitizer: DomSanitizer,
    private readonly emitter: EventEmitterService,
    private readonly translate: TranslateService,
    private readonly media: MediaObserver,
    private readonly uiService: UiService,
    @Inject(WINDOW) private readonly window: Window,
  ) {}

  /**
   * Updates store when sidebar is closed.
   */
  public sidebarCloseHandler(): void {
    void this.uiService.toggleSidenav();
  }

  /**
   * Checks if selected one is a current language.
   */
  private isCurrentLanguage(key: string): boolean {
    return key === this.translate.currentLanguage;
  }

  /**
   * Selects language.
   */
  private selectLanguage(key: string): void {
    if (!this.isCurrentLanguage(key)) {
      this.translate.use(key); // set current language
      this.setDatepickersLocale(key); // set datepickers locale
    }
  }

  /**
   * Sets preferred UI language.
   *
   * check preferred language, respect preference if dictionary exists
   * for now there are only dictionaries only: English, Russian
   * set Russian if it is preferred, else use English
   */
  private setPreferredLanguage(): void {
    const nav = this.window.navigator;
    const userPreference: string =
      nav.language === 'ru-RU' || nav.language === 'ru' || nav.languages[0] === 'ru' ? 'ru' : 'en';
    this.selectLanguage(userPreference); // set default language
  }

  /**
   * Sets datepickers locale.
   * Supported languages: en, ru.
   */
  private setDatepickersLocale(key: string): void {
    if (key === 'ru') {
      this.dateAdapter.setLocale('ru');
    } else {
      this.dateAdapter.setLocale('en');
    }
  }

  /**
   * Shows contact dialog.
   */
  public showContactDialog(): void {
    this.dialogInstance = this.dialog.open(AppContactDialog, {
      height: '85vh',
      width: '95vw',
      maxWidth: '1680',
      maxHeight: '1024',
      autoFocus: true,
      disableClose: false,
      data: {},
    });
    this.dialogInstance.afterClosed().subscribe(() => {
      this.dialogInstance = null;
    });
  }

  /**
   * Removes UI initialization object, kind of splashscreen.
   */
  private removeUIinit(): void {
    const initUIobj: HTMLElement = this.window.document.getElementById('init');
    initUIobj.parentNode.removeChild(initUIobj);
  }

  /**
   * Sets sidenav config object values.
   */
  private setGridConfig(cols: string, rowHeight?: string): void {
    this.gridConfig.cols = cols;
    this.gridConfig.rowHeight = Boolean(rowHeight) ? rowHeight : this.gridConfig.rowHeight;
  }

  /**
   * Adds icons to material icons registry.
   */
  private addIconsToRegistry(): void {
    this.matIconRegistry.addSvgIcon(
      'angular-logo',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/svg/Angular_logo.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'mailchimp-logo',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/svg/MailChimp_logo.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'soundcloud-logo',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/svg/SoundCloud_logo.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'twitter-logo',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/svg/TwitterBird_logo.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'dnbhub-logo-nobg-greyscale',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/svg/DH_logo-no_bg_greyscale.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'dnbhub-logo-roundbg',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/svg/DH_logo-round_bg.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'dnbhub-logo-roundbg-greyscale',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '/assets/svg/DH_logo-round_bg_greyscale.svg',
      ),
    );
  }

  /**
   * Subscribes to media change events.
   */
  private mediaChangeSubscribe(): void {
    this.media
      .asObservable()
      .pipe(untilDestroyed(this))
      .subscribe((event: MediaChange[]) => {
        console.warn('flex-layout media change event', event);
        if (/(lg|xl)/.test(event[0].mqAlias)) {
          this.setGridConfig('4', '2:1');
        } else if (/(md)/.test(event[0].mqAlias)) {
          this.setGridConfig('3', '1:1');
        } else if (/(sm)/.test(event[0].mqAlias)) {
          this.setGridConfig('2', '2:1');
        } else {
          this.setGridConfig('1', '2.5:1');
        }
      });
  }

  /**
   * Subscribes to event emitter events.
   */
  public eventEmitterSubscribe(): void {
    this.emitter
      .getEmitter()
      .pipe(untilDestroyed(this))
      .subscribe((event: { lang: string }) => {
        if (Boolean(event.lang)) {
          const supportedLanguage = Boolean(
            supportedLanguages.filter((item: ISupportedLanguage) => item.key === event.lang).length,
          );
          if (supportedLanguage) {
            this.selectLanguage(event.lang);
          } else {
            console.error('AppComponent, selected language is not supported');
          }
        }
      });
  }

  public ngOnInit(): void {
    this.removeUIinit();

    this.eventEmitterSubscribe();

    this.setPreferredLanguage();

    this.addIconsToRegistry();

    this.mediaChangeSubscribe();
  }
}
