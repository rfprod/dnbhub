import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { DnbhubUiService } from '../../state/ui/ui.service';
import { DnbhubUiState } from '../../state/ui/ui.store';
import { DnbhubContactDialogComponent } from '../contact-dialog/contact-dialog.component';

@Component({
  selector: 'dnbhub-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DnbhubToolbarComponent {
  @Select(DnbhubUiState.getSidenavOpened)
  public readonly sidenavOpened$!: Observable<boolean>;

  constructor(private readonly dialog: MatDialog, private readonly uiService: DnbhubUiService) {}

  public toggleSidebav(): void {
    void this.uiService.toggleSidenav().subscribe();
  }

  public showContactDialog(): void {
    this.dialog.open(DnbhubContactDialogComponent, {
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
