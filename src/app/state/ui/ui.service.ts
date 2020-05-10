import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { concatMap, tap } from 'rxjs/operators';

import { IUiService } from './ui.interface';
import { uiActions, UiState } from './ui.store';

@Injectable({
  providedIn: 'root',
})
export class UiService implements IUiService {
  constructor(private readonly store: Store, private readonly overlayContainer: OverlayContainer) {}

  public readonly darkThemeEnabled$ = this.store.select(UiState.getDarkThemeEnabled);

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
}
