import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { Store } from '@ngxs/store';
import { concatMap, tap } from 'rxjs/operators';
import { ESUPPORTED_LANGUAGE_KEY, TranslateService } from 'src/app/modules';

import { IUiService } from './ui.interface';
import { uiActions, UiState } from './ui.store';

@Injectable({
  providedIn: 'root',
})
export class UiService implements IUiService {
  constructor(
    private readonly store: Store,
    private readonly overlayContainer: OverlayContainer,
    private readonly dateAdapter: DateAdapter<Date>,
    private readonly translate: TranslateService,
  ) {}

  public readonly darkThemeEnabled$ = this.store.select(UiState.getDarkThemeEnabled);

  public readonly language$ = this.store.select(UiState.getLanguage);

  public readonly sidenavOpened$ = this.store.select(UiState.getSidenavOpened);

  private enableDarkTheme() {
    return this.store.dispatch(new uiActions.setUiState({ darkThemeEnabled: true })).pipe(
      tap(_ => {
        this.overlayContainer.getContainerElement().classList.add('unicorn-dark-theme');
      }),
    );
  }

  private disableDarkTheme() {
    return this.store.dispatch(new uiActions.setUiState({ darkThemeEnabled: false })).pipe(
      tap(_ => {
        this.overlayContainer.getContainerElement().classList.remove('unicorn-dark-theme');
      }),
    );
  }

  public toggleMaterialTheme() {
    return this.store.selectOnce(UiState.getDarkThemeEnabled).pipe(
      concatMap(darkThemeEnabled => {
        return darkThemeEnabled ? this.disableDarkTheme() : this.enableDarkTheme();
      }),
    );
  }

  public openSidenav() {
    return this.store.dispatch(new uiActions.setUiState({ sidenavOpened: true }));
  }

  public closeSidenav() {
    return this.store.dispatch(new uiActions.setUiState({ sidenavOpened: false }));
  }

  public toggleSidenav() {
    return this.store.selectOnce(UiState.getSidenavOpened).pipe(
      concatMap(sidenavOpened => {
        return sidenavOpened ? this.closeSidenav() : this.openSidenav();
      }),
    );
  }

  public selectLanguage(language: ESUPPORTED_LANGUAGE_KEY) {
    return this.store.selectOnce(UiState.getLanguage).pipe(
      concatMap(_ => this.store.dispatch(new uiActions.setUiState({ language }))),
      tap(_ => {
        this.translate.use(language);
        this.dateAdapter.setLocale(language);
      }),
    );
  }
}
