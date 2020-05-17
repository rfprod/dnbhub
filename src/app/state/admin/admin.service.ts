import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import { AdminApiService } from './admin-api.service';
import { IAdminService } from './admin.interface';
import { AdminState, blogActions } from './admin.store';

@Injectable({
  providedIn: 'root',
})
export class AdminService implements IAdminService {
  constructor(private readonly store: Store, private readonly api: AdminApiService) {}

  public readonly emailSubmissions$ = this.store.select(AdminState.getEmailSubmissions);

  public readonly emailMessages$ = this.store.select(AdminState.getEmailMessages);

  public readonly brands$ = this.store.select(AdminState.getBrands);

  public readonly users$ = this.store.select(AdminState.getUsers);

  public readonly blogEntriesIDs$ = this.store.select(AdminState.getBlogEntriesIDs);

  public getEmailSubmissions() {
    return this.api.getEmailSubmissions().pipe(
      tap(emailSubmissions => {
        this.store.dispatch(new blogActions.setAdminState({ emailSubmissions }));
      }),
    );
  }

  public getEmailMessages() {
    return this.api.getEmailMessages().pipe(
      tap(emailMessages => {
        this.store.dispatch(new blogActions.setAdminState({ emailMessages }));
      }),
    );
  }

  public getBrands() {
    return this.api.getBrands().pipe(
      tap(brands => {
        this.store.dispatch(new blogActions.setAdminState({ brands }));
      }),
    );
  }

  public getUsers() {
    return this.api.getUsers().pipe(
      tap(users => {
        this.store.dispatch(new blogActions.setAdminState({ users }));
      }),
    );
  }

  public getBlogEntriesIDs() {
    return this.api.getBlogEntriesIDs().pipe(
      tap(blogEntriesIDs => {
        this.store.dispatch(new blogActions.setAdminState({ blogEntriesIDs }));
      }),
    );
  }
}
