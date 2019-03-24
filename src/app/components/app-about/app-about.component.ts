import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialog } from '@angular/material';

import { EventEmitterService } from 'src/app/services/event-emitter/event-emitter.service';
import { CustomDeferredService } from 'src/app/services/custom-deferred/custom-deferred.service';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';

import { AppContactDialog } from 'src/app/components/app-contact/app-contact.component';

import { TranslateService } from 'src/app/modules/translate/translate.service';
import { DataSnapshot, DatabaseReference } from '@angular/fire/database/interfaces';

@Component({
  selector: 'app-about',
  templateUrl: './app-about.component.html',
  host: {
    class: 'mat-body-1'
  }
})
export class AppAboutComponent implements OnInit, OnDestroy {

  /**
   * @param dialog Reusable dialog
   * @param emitter Event emitter service
   * @param translateService Translate service - UI translation to predefined languages
   * @param firebaseService Firebase service
   * @param window Window reference
   */
  constructor(
    private dialog: MatDialog,
    private emitter: EventEmitterService,
    private translateService: TranslateService,
    private firebaseService: FirebaseService,
    @Inject('Window') private window: Window
  ) {}

  /**
   * Company details object.
   */
  public details: {
    links?: {
      soundcloud: string;
      rss: string;
      mixcloud: string;
      twitter: string;
      facebook: string;
      youtube: string;
      instagram: string;
      bandcamp: string;
    },
    soundcloudUserId?: number,
    text?: string,
    title?: string,
    widgetLink?: string,
    poweredBy?: {name: string, logo: string}[]
  } = {};

  /**
   * Gets company details from firebase.
   */
  private getDetails(): Promise<any> {
    const def = new CustomDeferredService<any>();
    this.emitter.emitSpinnerStartEvent();
    (this.firebaseService.getDB('about', false) as Promise<DataSnapshot>)
      .then((snapshot) => {
        console.log('getDetails, about', snapshot.val());
        const response = snapshot.val();
        this.details = {};
        const keys = Object.keys(response);
        keys.forEach((key) => {
          this.details[key] = response[key];
        });
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
    this.getDetails();
  }
  /**
   * Lifecycle hook called after component is destroyed.
   */
  public ngOnDestroy(): void {
    console.log('ngOnDestroy: AppAboutComponent destroyed');
    (this.firebaseService.getDB('about', true) as DatabaseReference).off();
  }
}
