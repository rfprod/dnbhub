import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UiService } from 'src/app/state/ui/ui.service';
import { UiState } from 'src/app/state/ui/ui.store';

import { AppContactDialog } from '../app-contact/app-contact.component';

/**
 * Application toolbar component.
 */
@Component({
  selector: 'app-toolbar',
  templateUrl: './app-toolbar.component.html',
  styleUrls: ['./app-toolbar.component.scss'],
  host: {
    class: 'mat-body-1',
  },
})
export class AppToolbarComponent {
  @Select(UiState.getSidenavOpened)
  public readonly sidenavOpened$: Observable<boolean>;

  constructor(private readonly dialog: MatDialog, private readonly uiService: UiService) {}

  /**
   * Updates store when sidebar is closed.
   */
  public toggleSidebav(): void {
    void this.uiService.toggleSidenav().subscribe();
  }

  /**
   * Shows contact dialog.
   */
  public showContactDialog(): void {
    this.dialog.open(AppContactDialog, {
      height: '85vh',
      width: '95vw',
      maxWidth: '1680',
      maxHeight: '1024',
      autoFocus: true,
      disableClose: false,
      data: {},
    });
  }
}
