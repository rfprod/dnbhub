import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { DnbhubContactDialogComponent } from '../../components/contact-dialog/contact-dialog.component';
import { DnbhubAboutService } from '../../state/about/about.service';

@Component({
  selector: 'dnbhub-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DnbhubAboutComponent {
  public readonly details$ = this.about.details$.pipe(
    concatMap(details => {
      return Boolean(details) && Boolean(details.soundcloudUserId)
        ? of(details)
        : this.about.getDetails();
    }),
  );

  constructor(private readonly dialog: MatDialog, private readonly about: DnbhubAboutService) {}

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
