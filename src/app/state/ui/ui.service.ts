import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { Store } from '@ngxs/store';
import { concatMap, filter, tap } from 'rxjs/operators';
import { DnbhubTranslateService } from 'src/app/modules/translate/translate.service';
import { SUPPORTED_LANGUAGE_KEY } from 'src/app/modules/translate/translations.interface';

import { uiActions } from './ui.actions';
import { IDnbhubUiService } from './ui.interface';
import { DnbhubUiState } from './ui.store';

@Injectable({
  providedIn: 'root',
})
export class DnbhubUiService implements IDnbhubUiService {
  constructor(
    private readonly store: Store,
    private readonly overlayContainer: OverlayContainer,
    private readonly dateAdapter: DateAdapter<Date>,
    private readonly translate: DnbhubTranslateService,
  ) {}

  public readonly darkThemeEnabled$ = this.store.select(DnbhubUiState.getDarkThemeEnabled);

  public readonly language$ = this.store.select(DnbhubUiState.getLanguage);

  public readonly sidenavOpened$ = this.store.select(DnbhubUiState.getSidenavOpened);

  private enableDarkTheme() {
    return this.store.dispatch(new uiActions.setDnbhubUiState({ darkThemeEnabled: true })).pipe(
      tap(() => {
        this.overlayContainer.getContainerElement().classList.add('unicorn-dark-theme');
      }),
    );
  }

  private disableDarkTheme() {
    return this.store.dispatch(new uiActions.setDnbhubUiState({ darkThemeEnabled: false })).pipe(
      tap(() => {
        this.overlayContainer.getContainerElement().classList.remove('unicorn-dark-theme');
      }),
    );
  }

  public toggleMaterialTheme() {
    return this.store.selectOnce(DnbhubUiState.getDarkThemeEnabled).pipe(
      concatMap(darkThemeEnabled => {
        return darkThemeEnabled ? this.disableDarkTheme() : this.enableDarkTheme();
      }),
    );
  }

  public openSidenav() {
    return this.store.dispatch(new uiActions.setDnbhubUiState({ sidenavOpened: true }));
  }

  public closeSidenav() {
    return this.store.dispatch(new uiActions.setDnbhubUiState({ sidenavOpened: false }));
  }

  public toggleSidenav() {
    return this.store.selectOnce(DnbhubUiState.getSidenavOpened).pipe(
      concatMap(sidenavOpened => {
        return sidenavOpened ? this.closeSidenav() : this.openSidenav();
      }),
    );
  }

  public selectLanguage(language: SUPPORTED_LANGUAGE_KEY) {
    return this.store.selectOnce(DnbhubUiState.getLanguage).pipe(
      filter(value => Boolean(value)),
      concatMap(() => this.store.dispatch(new uiActions.setDnbhubUiState({ language }))),
      tap(() => {
        this.translate.use(language);
        this.dateAdapter.setLocale(language);
      }),
    );
  }
}
