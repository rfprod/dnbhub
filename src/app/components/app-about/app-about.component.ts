import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { AppContactDialog } from 'src/app/components/app-contact/app-contact.component';
import { AboutService } from 'src/app/state/about/about.service';

@Component({
  selector: 'app-about',
  templateUrl: './app-about.component.html',
  styleUrls: ['./app-about.component.scss'],
  host: {
    class: 'mat-body-1',
  },
})
export class AppAboutComponent {
  public readonly details$ = this.about.details$.pipe(
    concatMap(details => {
      return Boolean(details) && Boolean(details.soundcloudUserId)
        ? of(details)
        : this.about.getDetails();
    }),
  );

  constructor(private readonly dialog: MatDialog, private readonly about: AboutService) {}

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
