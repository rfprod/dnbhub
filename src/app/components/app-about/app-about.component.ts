import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatabaseReference, DataSnapshot } from '@angular/fire/database/interfaces';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { from, Observable } from 'rxjs';
import { AppContactDialog } from 'src/app/components/app-contact/app-contact.component';
import { IAboutDetails } from 'src/app/interfaces';
import { AppSpinnerService } from 'src/app/services';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { DnbhubStoreAction } from 'src/app/state/dnbhub-store.actions';
import { DnbhubStoreState } from 'src/app/state/dnbhub-store.state';

@Component({
  selector: 'app-about',
  templateUrl: './app-about.component.html',
  host: {
    class: 'mat-body-1',
  },
})
export class AppAboutComponent implements OnInit, OnDestroy {
  @Select(DnbhubStoreState.getAbout)
  public readonly details$: Observable<IAboutDetails>;

  private dialogRef: MatDialogRef<AppContactDialog>;

  constructor(
    private readonly dialog: MatDialog,
    private readonly spinner: AppSpinnerService,
    private readonly firebaseService: FirebaseService,
    private readonly store: Store,
  ) {}

  /**
   * Gets company details from firebase.
   * TODO: move from the component.
   */
  private getDetails(): Observable<void | IAboutDetails> {
    this.spinner.startSpinner();
    const promise = (this.firebaseService.getDB('about', false) as Promise<DataSnapshot>)
      .then(snapshot => {
        const details: IAboutDetails = snapshot.val();
        this.store.dispatch(new DnbhubStoreAction({ details }));
        this.spinner.stopSpinner();
        return details;
      })
      .catch(error => {
        this.spinner.stopSpinner();
      });
    return from(promise);
  }

  /**
   * Shows contact dialog.
   */
  public showContactDialog(): void {
    this.dialogRef = this.dialog.open(AppContactDialog, {
      height: '85vh',
      width: '95vw',
      maxWidth: '1680',
      maxHeight: '1024',
      autoFocus: true,
      disableClose: false,
      data: {},
    });
    this.dialogRef.afterClosed().subscribe(_ => {
      this.dialogRef = null;
    });
  }

  public ngOnInit(): void {
    this.getDetails().subscribe();
  }

  public ngOnDestroy(): void {
    (this.firebaseService.getDB('about', true) as DatabaseReference).off();
  }
}
