import { Component, OnInit, OnDestroy } from '@angular/core';

import { EventEmitterService } from 'src/app/services/event-emitter/event-emitter.service';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';

/**
 * Application admin component.
 */
@Component({
  selector: 'app-admin',
  templateUrl: './app-admin.component.html',
  host: {
    class: 'mat-body-1'
  }
})
export class AppAdminComponent implements OnInit, OnDestroy {

  /**
   * @param emitter Event emitter service
   * @param firebaseService Firebase service
   */
  constructor(
    private emitter: EventEmitterService,
    private firebaseService: FirebaseService
  ) {}

  public details: any = {};

  public ngOnInit(): void {
    console.log('ngOnInit: AppAdminComponent initialized');
  }

  public ngOnDestroy(): void {
    console.log('ngOnDestroy: AppAdminComponent destroyed');
  }
}
