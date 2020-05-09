import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { DatabaseReference, DataSnapshot } from '@angular/fire/database/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { Subscription } from 'rxjs';
import { AppContactDialog } from 'src/app/components/app-contact/app-contact.component';
import { IAboutDetails } from 'src/app/interfaces';
import { AppSpinnerService } from 'src/app/services';
import { CustomDeferredService } from 'src/app/services/custom-deferred/custom-deferred.service';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { DnbhubStoreAction } from 'src/app/state/dnbhub-store.actions';
import { DnbhubStoreStateModel } from 'src/app/state/dnbhub-store.state';

@Component({
  selector: 'app-about',
  templateUrl: './app-about.component.html',
  host: {
    class: 'mat-body-1',
  },
})
export class AppAboutComponent implements OnInit, AfterContentInit, OnDestroy {
  /**
   * @param dialog Reusable dialog
   * @param spinner Application spinner service
   * @param firebaseService Firebase service
   * @param ngXsStore NgXsStore
   */
  constructor(
    private readonly dialog: MatDialog,
    private readonly spinner: AppSpinnerService,
    private readonly firebaseService: FirebaseService,
    private readonly ngXsStore: Store,
  ) {}

  /**
   * Company details object.
   */
  public details: IAboutDetails = new IAboutDetails();

  /**
   * Gets company details from firebase.
   */
  private getDetails(): Promise<any> {
    const def = new CustomDeferredService<any>();
    this.spinner.startSpinner();
    (this.firebaseService.getDB('about', false) as Promise<DataSnapshot>)
      .then(snapshot => {
        console.log('getDetails, about', snapshot.val());
        const details: IAboutDetails = snapshot.val();
        this.ngXsStore.dispatch(new DnbhubStoreAction({ details }));
        this.spinner.stopSpinner();
        def.resolve();
      })
      .catch(error => {
        console.log('getDetails, error', error);
        this.spinner.stopSpinner();
        def.reject();
      });
    return def.promise;
  }

  /**
   * NgXsStore subscription.
   */
  private ngXsStoreSubscription: Subscription;

  /**
   * Subscribes to state change and takes action.
   */
  private stateSubscription(): void {
    this.ngXsStoreSubscription = this.ngXsStore.subscribe(
      (state: { dnbhubStore: DnbhubStoreStateModel }) => {
        console.log('stateSubscription, state', state);
        this.details = state.dnbhubStore.details;
      },
    );
  }

  /**
   * Reusable modal dialog instance.
   */
  private dialogInstance: any;

  /**
   * Shows contact dialog.
   */
  public showContactDialog(): void {
    this.dialogInstance = this.dialog.open(AppContactDialog, {
      height: '85vh',
      width: '95vw',
      maxWidth: '1680',
      maxHeight: '1024',
      autoFocus: true,
      disableClose: false,
      data: {},
    });
    this.dialogInstance.afterClosed().subscribe((result: any) => {
      console.log('contact doalog closed with result', result);
      this.dialogInstance = undefined;
    });
  }

  /**
   * Lifecycle hook called after component is initialized.
   */
  public ngOnInit(): void {
    console.log('ngOnInit: AppAboutComponent initialized');
    this.stateSubscription();
    this.getDetails();
  }
  /**
   * Lifecycle hook called after component content is initialized .
   */
  public ngAfterContentInit(): void {
    console.log('ngOnInit: AppAboutComponent initialized');
    this.stateSubscription();
    this.getDetails();
  }
  /**
   * Lifecycle hook called after component is destroyed.
   */
  public ngOnDestroy(): void {
    console.log('ngOnDestroy: AppAboutComponent destroyed');
    (this.firebaseService.getDB('about', true) as DatabaseReference).off();
    if (this.ngXsStoreSubscription) {
      this.ngXsStoreSubscription.unsubscribe();
    }
  }
}
