import { Injectable, OnDestroy } from '@angular/core';
import { from } from 'rxjs';
import { Brand, IBrands } from 'src/app/interfaces';
import {
  IEmailMessage,
  IEmailMessages,
  IEmailSubmission,
  IEmailSubmissions,
} from 'src/app/interfaces/admin';
import { IFirebaseUserRecord, IFirebaseUserRecords } from 'src/app/interfaces/firebase';
import { FirebaseService } from 'src/app/services';
import { HttpHandlersService } from 'src/app/services/http-handlers/http-handlers.service';

/**
 * Admin API service.
 */
@Injectable({
  providedIn: 'root',
})
export class AdminApiService implements OnDestroy {
  constructor(
    private readonly handlers: HttpHandlersService,
    private readonly firebase: FirebaseService,
  ) {}

  public getEmailSubmissions() {
    const promise = (this.firebase.getDB(
      'emails/blogSubmissions',
      true,
    ) as firebase.database.Reference)
      .once('value')
      .then(snapshot => {
        const response: IEmailSubmissions = snapshot.val();
        return Object.keys(response).map(key => {
          const result: IEmailSubmission = { ...response[key] };
          result.key = key;
          return result;
        });
      });
    return this.handlers.pipeHttpRequest<IEmailSubmission[]>(from(promise));
  }

  public getEmailMessages() {
    const promise = (this.firebase.getDB('emails/messages', true) as firebase.database.Reference)
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
    const promise = (this.firebase.getDB('brands', true) as firebase.database.Reference)
      .once('value')
      .then(snapshot => {
        const response: IBrands = snapshot.val();
        return Object.keys(response).map(key => {
          const result: Brand = { ...response[key] };
          result.key = key;
          return result;
        });
      });
    return this.handlers.pipeHttpRequest<Brand[]>(from(promise));
  }

  public getUsers() {
    const promise = (this.firebase.getDB('users', true) as firebase.database.Reference)
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
    const promise = (this.firebase.getDB('blogEntriesIDs', true) as firebase.database.Reference)
      .once('value')
      .then(snapshot => {
        const response: [number[]] = snapshot.val();
        return response[0];
      });
    return this.handlers.pipeHttpRequest<number[]>(from(promise));
  }

  public ngOnDestroy() {
    (this.firebase.getDB('emails/blogSubmissions', true) as firebase.database.Reference).off();
    (this.firebase.getDB('emails/messages', true) as firebase.database.Reference).off();
    (this.firebase.getDB('brands', true) as firebase.database.Reference).off();
    (this.firebase.getDB('users', true) as firebase.database.Reference).off();
    (this.firebase.getDB('blogEntriesIDs', true) as firebase.database.Reference).off();
  }
}
