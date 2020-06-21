import { Component, Inject, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ESUPPORTED_LANGUAGE_KEY } from 'src/app/modules/translate/index';

import { DnbhubUiService } from './state/ui/ui.service';
import { DnbhubUiState } from './state/ui/ui.store';
import { WINDOW } from './utils';

/**
 * Application root component.
 */
@UntilDestroy()
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'dnbhub-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class DnbhubRootComponent implements OnInit {
  @Select(DnbhubUiState.getSidenavOpened)
  public readonly sidenavOpened$: Observable<boolean>;

  /**
   * Sidenav grid configuration object.
   */
  public gridConfig: { cols: string; rowHeight: string } = {
    cols: '3',
    rowHeight: '1:1',
  };

  constructor(
    private readonly matIconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer,
    private readonly media: MediaObserver,
    private readonly ui: DnbhubUiService,
    @Inject(WINDOW) private readonly window: Window,
  ) {}

  /**
   * Updates store when sidebar is closed.
   */
  public sidebarCloseHandler(): void {
    void this.ui.closeSidenav().subscribe();
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
    const userPreference =
      nav.language === 'ru-RU' || nav.language === 'ru' || nav.languages[0] === 'ru'
        ? ESUPPORTED_LANGUAGE_KEY.RUSSIAN
        : ESUPPORTED_LANGUAGE_KEY.ENGLISH;
    void this.ui.selectLanguage(userPreference).subscribe();
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
    void this.media
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

  public ngOnInit(): void {
    this.removeUIinit();

    this.setPreferredLanguage();

    this.addIconsToRegistry();

    this.mediaChangeSubscribe();
  }
}
