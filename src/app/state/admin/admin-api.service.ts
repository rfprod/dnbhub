import { Injectable } from '@angular/core';
import { first, map, tap } from 'rxjs/operators';
import { DnbhubBrand } from 'src/app/interfaces';
import { IEmailMessage } from 'src/app/interfaces/admin';
import { IFirebaseUserRecord } from 'src/app/interfaces/firebase';
import { DnbhubHttpHandlersService } from 'src/app/services/http-handlers/http-handlers.service';
import { DnbhubFirebaseService } from 'src/app/state/firebase/firebase.service';

@Injectable({
  providedIn: 'root',
})
export class DnbhubAdminApiService {
  constructor(
    private readonly handlers: DnbhubHttpHandlersService,
    private readonly firebase: DnbhubFirebaseService,
  ) {}

  public getEmails() {
    const observable = this.firebase
      .getList<IEmailMessage>('emails/messages')
      .valueChanges()
      .pipe(
        first(),
        tap(items => {
          const response: IEmailMessage[] = [...items];
          return Object.keys(response).map(key => {
            const result: IEmailMessage = { ...response[key] };
            result.key = key;
            return result;
          });
        }),
      );
    return this.handlers.pipeHttpRequest<IEmailMessage[]>(observable);
  }

  public getBrands() {
    const observable = this.firebase
      .getList<DnbhubBrand>('brands')
      .valueChanges()
      .pipe(
        first(),
        tap(items => {
          const response: DnbhubBrand[] = [...items];
          return Object.keys(response).map(key => {
            const input = { ...response[key], key } as DnbhubBrand;
            const result = new DnbhubBrand(input);
            return result;
          });
        }),
      );
    return this.handlers.pipeHttpRequest<DnbhubBrand[]>(observable);
  }

  public getUsers() {
    const observable = this.firebase
      .getList<IFirebaseUserRecord>('users')
      .valueChanges()
      .pipe(
        first(),
        tap(items => {
          const response: IFirebaseUserRecord[] = [...items];
          return Object.keys(response).map(key => {
            const result: IFirebaseUserRecord = { ...response[key] };
            result.key = key;
            return result;
          });
        }),
      );
    return this.handlers.pipeHttpRequest<IFirebaseUserRecord[]>(observable);
  }

  public getBlogEntriesIDs() {
    const observable = this.firebase
      .getList<number[]>('blogEntriesIDs')
      .valueChanges()
      .pipe(
        first(),
        map(items => {
          const response = items[0];
          return response;
        }),
      );
    return this.handlers.pipeHttpRequest<number[]>(observable);
  }
}
