import { Component, OnInit, OnDestroy, Inject, AfterContentInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { EventEmitterService } from 'src/app/services/event-emitter/event-emitter.service';
import { CustomDeferredService } from 'src/app/services/custom-deferred/custom-deferred.service';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';

import { AppContactDialog } from 'src/app/components/app-contact/app-contact.component';

import { TranslateService } from 'src/app/modules/translate/translate.service';
import { DataSnapshot, DatabaseReference } from '@angular/fire/database/interfaces';
import { IAboutDetails } from 'src/app/interfaces';
import { Store } from '@ngxs/store';
import { DnbhubStoreStateModel } from 'src/app/state/dnbhub-store.state';
import { DnbhubStoreAction } from 'src/app/state/dnbhub-store.actions';

@Component({
  selector: 'app-about',
  templateUrl: './app-about.component.html',
  host: {
    class: 'mat-body-1'
  }
})
export class AppAboutComponent implements OnInit, AfterContentInit, OnDestroy {

  /**
   * @param dialog Reusable dialog
   * @param emitter Event emitter service
   * @param translateService Translate service - UI translation to predefined languages
   * @param firebaseService Firebase service
   * @param ngXsStore NgXsStore
   * @param window Window reference
   */
  constructor(
    private dialog: MatDialog,
    private emitter: EventEmitterService,
    private translateService: TranslateService,
    private firebaseService: FirebaseService,
    private ngXsStore: Store,
    @Inject('Window') private window: Window
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
    this.emitter.emitSpinnerStartEvent();
    (this.firebaseService.getDB('about', false) as Promise<DataSnapshot>)
      .then((snapshot) => {
        console.log('getDetails, about', snapshot.val());
        const details: IAboutDetails = snapshot.val();
        this.ngXsStore.dispatch(new DnbhubStoreAction({ details }));
        this.emitter.emitSpinnerStopEvent();
        def.resolve();
      })
      .catch((error) => {
        console.log('getDetails, error', error);
        this.emitter.emitSpinnerStopEvent();
        def.reject();
      });
    return def.promise;
  }

  /**
   * NgXsStore subscription.
   */
  private ngXsStoreSubscription: any;

  /**
   * Subscribes to state change and takes action.
   */
  private stateSubscription(): void {
    this.ngXsStoreSubscription = this.ngXsStore.subscribe((state: { dnbhubStore : DnbhubStoreStateModel }) => {
      console.log('stateSubscription, state', state);
      this.details = state.dnbhubStore.details;
    });
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
      data: {}
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
    this.ngXsStoreSubscription.unsubscribe();
  }
}
