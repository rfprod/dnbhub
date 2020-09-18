import { Injectable, OnDestroy } from '@angular/core';
import { from } from 'rxjs';
import { DnbhubBrand, IBrands } from 'src/app/interfaces';
import { IEmailMessage, IEmailMessages } from 'src/app/interfaces/admin';
import { IFirebaseUserRecord, IFirebaseUserRecords } from 'src/app/interfaces/firebase';
import { DnbhubFirebaseService } from 'src/app/services/firebase/firebase.service';
import { DnbhubHttpHandlersService } from 'src/app/services/http-handlers/http-handlers.service';

/**
 * Admin API service.
 */
@Injectable({
  providedIn: 'root',
})
export class DnbhubAdminApiService implements OnDestroy {
  constructor(
    private readonly handlers: DnbhubHttpHandlersService,
    private readonly firebase: DnbhubFirebaseService,
  ) {}

  public getEmails() {
    const promise = this.firebase
      .getDB('emails/messages')
      .once('value')
      .then(snapshot => {
        const response: IEmailMessages = snapshot.val();
        return Object.keys(response).map(key => {
          const result: IEmailMessage = { ...response[key] };
          result.key = key;
          return result;
        });
      });
    return this.handlers.pipeHttpRequest<IEmailMessage[]>(from(promise));
  }

  public getBrands() {
    const promise = this.firebase
      .getDB('brands')
      .once('value')
      .then(snapshot => {
        const response: IBrands = snapshot.val();
        return Object.keys(response).map(key => {
          const input = { ...response[key], key } as DnbhubBrand;
          const result = new DnbhubBrand(input);
          return result;
        });
      });
    return this.handlers.pipeHttpRequest<DnbhubBrand[]>(from(promise));
  }

  public getUsers() {
    const promise = this.firebase
      .getDB('users')
      .once('value')
      .then(snapshot => {
        const response: IFirebaseUserRecords = snapshot.val();
        return Object.keys(response).map(key => {
          const result: IFirebaseUserRecord = { ...response[key] };
          result.key = key;
          return result;
        });
      });
    return this.handlers.pipeHttpRequest<IFirebaseUserRecord[]>(from(promise));
  }

  public getBlogEntriesIDs() {
    const promise = this.firebase
      .getDB('blogEntriesIDs')
      .once('value')
      .then(snapshot => {
        const response: [number[]] = snapshot.val();
        return response[0];
      });
    return this.handlers.pipeHttpRequest<number[]>(from(promise));
  }

  public ngOnDestroy() {
    this.firebase.getDB('emails/messages').off();
    this.firebase.getDB('brands').off();
    this.firebase.getDB('users').off();
    this.firebase.getDB('blogEntriesIDs').off();
  }
}
