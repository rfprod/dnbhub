import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map } from 'rxjs/operators';

import { DnbhubBrand } from '../../interfaces/brand/brand.interface';
import { IFirebaseUserRecord } from '../../interfaces/firebase/firebase-user.interface';

@Component({
  selector: 'dnbhub-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DnbhubAdminUsersComponent {
  @Input() public users: IFirebaseUserRecord[] | null = [];

  @Input() public brands: DnbhubBrand[] | null = [];

  @Input() public blogEntriesIDs: number[] | null = [];

  @Input() public selectedBrand: DnbhubBrand | null = null;

  @Output() public readonly submissionApproved = new EventEmitter<number>();

  @Output() public readonly submissionRejected = new EventEmitter<number>();

  @Output() public readonly brandSelected = new EventEmitter<string | undefined>();

  @Output() public readonly brandSelectedFromList =
    new EventEmitter<MatAutocompleteSelectedEvent>();

  public brandAutocompleteControl: FormControl = new FormControl();

  public readonly matchedBrands$ = this.brandAutocompleteControl.valueChanges.pipe(
    map(({ changes }) => {
      const matchedKeys = this.brands?.filter(item =>
        new RegExp(this.brandAutocompleteControl.value, 'i').test(item.key ?? ''),
      );
      return matchedKeys ?? [];
    }),
  );

  public submissionAlreadyAdded(key: string) {
    return this.blogEntriesIDs?.includes(parseInt(key, 10));
  }

  public approveUserSubmission(submissionId: number): void {
    this.submissionApproved.emit(submissionId);
  }

  public rejectSubmission(submissionId: number): void {
    this.submissionRejected.next(submissionId);
  }

  public selectBrand(brandId?: string) {
    this.brandSelected.next(brandId);
  }

  public selectBrandFromList(event: MatAutocompleteSelectedEvent) {
    this.brandSelectedFromList.next(event);
  }
}
