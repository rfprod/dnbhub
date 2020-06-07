import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { concatMap, first, map, mapTo, tap } from 'rxjs/operators';

import { DnbhubAdminApiService } from './admin-api.service';
import { IDnbhubAdminService } from './admin.interface';
import { blogActions, DnbhubAdminState } from './admin.store';

@Injectable({
  providedIn: 'root',
})
export class DnbhubAdminService implements IDnbhubAdminService {
  constructor(private readonly store: Store, private readonly api: DnbhubAdminApiService) {}

  public readonly emailSubmissions$ = this.store.select(DnbhubAdminState.getEmailSubmissions);

  public readonly emailMessages$ = this.store.select(DnbhubAdminState.getEmailMessages);

  public readonly brands$ = this.store.select(DnbhubAdminState.getBrands);

  public readonly users$ = this.store.select(DnbhubAdminState.getUsers);

  public readonly blogEntriesIDs$ = this.store.select(DnbhubAdminState.getBlogEntriesIDs);

  public readonly selectedBrand$ = this.store.select(DnbhubAdminState.getSelectedBrand);

  public getEmailSubmissions() {
    return this.api.getEmailSubmissions().pipe(
      tap(emailSubmissions => {
        this.store.dispatch(new blogActions.setDnbhubAdminState({ emailSubmissions }));
      }),
    );
  }

  public getEmailMessages() {
    return this.api.getEmailMessages().pipe(
      tap(emailMessages => {
        this.store.dispatch(new blogActions.setDnbhubAdminState({ emailMessages }));
      }),
    );
  }

  public getBrands() {
    return this.api.getBrands().pipe(
      tap(brands => {
        this.store.dispatch(new blogActions.setDnbhubAdminState({ brands }));
      }),
    );
  }

  public getUsers() {
    return this.api.getUsers().pipe(
      tap(users => {
        this.store.dispatch(new blogActions.setDnbhubAdminState({ users }));
      }),
    );
  }

  public getBlogEntriesIDs() {
    return this.api.getBlogEntriesIDs().pipe(
      tap(blogEntriesIDs => {
        this.store.dispatch(new blogActions.setDnbhubAdminState({ blogEntriesIDs }));
      }),
    );
  }

  public selectBrand(key?: string) {
    return this.brands$.pipe(
      first(),
      map(brands => brands.find(brand => brand.key === key)),
      concatMap(selectedBrand =>
        this.store
          .dispatch(new blogActions.setDnbhubAdminState({ selectedBrand }))
          .pipe(mapTo(selectedBrand)),
      ),
    );
  }
}
