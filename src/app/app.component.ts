import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
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
@Component({
  selector: 'dnbhub-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    private readonly media: MediaObserver,
    private readonly ui: DnbhubUiService,
    @Inject(WINDOW) private readonly win: Window,
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
    const nav = this.win.navigator;
    const userPreference =
      nav?.language === 'ru-RU' || nav?.language === 'ru' || nav?.languages[0] === 'ru'
        ? ESUPPORTED_LANGUAGE_KEY.RUSSIAN
        : ESUPPORTED_LANGUAGE_KEY.ENGLISH;
    void this.ui.selectLanguage(userPreference).subscribe();
  }

  /**
   * Sets sidenav config object values.
   */
  private setGridConfig(cols: string, rowHeight?: string): void {
    this.gridConfig.cols = cols;
    this.gridConfig.rowHeight = Boolean(rowHeight) ? rowHeight : this.gridConfig.rowHeight;
  }

  /**
   * Subscribes to media change events.
   */
  private mediaChangeSubscribe(): void {
    void this.media
      .asObservable()
      .pipe(untilDestroyed(this))
      .subscribe((event: MediaChange[]) => {
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
    this.setPreferredLanguage();

    this.mediaChangeSubscribe();
  }
}
