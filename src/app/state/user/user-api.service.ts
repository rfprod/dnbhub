import { Injectable } from '@angular/core';
import { filter, first, map } from 'rxjs/operators';
import { IFirebaseUserRecord } from 'src/app/interfaces/firebase';
import { DnbhubFirebaseService } from 'src/app/services/firebase/firebase.service';
import { DnbhubHttpHandlersService } from 'src/app/services/http-handlers/http-handlers.service';

@Injectable({
  providedIn: 'root',
})
export class DnbhubUserApiService {
  constructor(
    private readonly handlers: DnbhubHttpHandlersService,
    private readonly firebase: DnbhubFirebaseService,
  ) {}

  public getUserRecord(id: string) {
    const observable = this.firebase
      .getListItem<IFirebaseUserRecord>(`users/${id}`)
      .valueChanges()
      .pipe(
        filter(user => user !== null),
        first(),
        map(user => user as IFirebaseUserRecord),
      );
    return this.handlers.pipeHttpRequest<IFirebaseUserRecord>(observable);
  }
}
