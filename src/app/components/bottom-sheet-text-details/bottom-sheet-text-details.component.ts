import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { DnbhubBottomSheetTextDetailsData } from 'src/app/interfaces';

/**
 * Bottom sheet text details component.
 */
@Component({
  selector: 'dnbhub-bottom-sheet-text-details',
  templateUrl: './bottom-sheet-text-details.component.html',
  styleUrls: ['./bottom-sheet-text-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DnbhubBottomSheetTextDetailsComponent {
  /**
   * DnbhubBottomSheetTextDetailsComponent constructor.
   * @param bottomSheetRef bottom sheet reference
   * @param data bottom sheet data
   */
  constructor(
    private readonly bottomSheetRef: MatBottomSheetRef<DnbhubBottomSheetTextDetailsComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: DnbhubBottomSheetTextDetailsData,
  ) {}

  /**
   * Closes sheet.
   * @param event mouse event
   */
  public close(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
