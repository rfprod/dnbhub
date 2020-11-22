import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { concatMap, first, map, mapTo, tap } from 'rxjs/operators';
import { SoundcloudPlaylist } from 'src/app/interfaces';

import { IDnbhubAdminService } from './admin.interface';
import { blogActions, DnbhubAdminState } from './admin.store';
import { DnbhubAdminApiService } from './admin-api.service';

@Injectable({
  providedIn: 'root',
})
export class DnbhubAdminService implements IDnbhubAdminService {
  constructor(private readonly store: Store, private readonly api: DnbhubAdminApiService) {}

  public readonly emails$ = this.store.select(DnbhubAdminState.getEmails);

  public readonly brands$ = this.store.select(DnbhubAdminState.getBrands);

  public readonly users$ = this.store.select(DnbhubAdminState.getUsers);

  public readonly blogEntriesIDs$ = this.store.select(DnbhubAdminState.getBlogEntriesIDs);

  public readonly selectedBrand$ = this.store.select(DnbhubAdminState.getSelectedBrand);

  public readonly selectedSubmission$ = this.store.select(DnbhubAdminState.getSelectedSubmission);

  public getEmails() {
    return this.api.getEmails().pipe(
      tap(emails => {
        void this.store.dispatch(new blogActions.setDnbhubAdminState({ emails }));
      }),
    );
  }

  public getBrands() {
    return this.api.getBrands().pipe(
      tap(brands => {
        void this.store.dispatch(new blogActions.setDnbhubAdminState({ brands }));
      }),
    );
  }

  public getUsers() {
    return this.api.getUsers().pipe(
      tap(users => {
        void this.store.dispatch(new blogActions.setDnbhubAdminState({ users }));
      }),
    );
  }

  public getBlogEntriesIDs() {
    return this.api.getBlogEntriesIDs().pipe(
      tap(blogEntriesIDs => {
        void this.store.dispatch(new blogActions.setDnbhubAdminState({ blogEntriesIDs }));
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

  public selectSubmission(selectedSubmission?: SoundcloudPlaylist) {
    return this.store
      .dispatch(new blogActions.setDnbhubAdminState({ selectedSubmission }))
      .pipe(mapTo(selectedSubmission));
  }
}
