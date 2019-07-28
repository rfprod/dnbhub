import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { BottomSheetTextDetailsData } from 'src/app/interfaces';

/**
 * Bottom sheet text details component.
 */
@Component({
  selector: 'bottom-sheet-text-details',
  templateUrl: 'bottom-sheet-text-details.component.html',
})
export class BottomSheetTextDetailsComponent {

  /**
   * BottomSheetTextDetailsComponent constructor.
   * @param bottomSheetRef bottom sheet reference
   * @param data bottom sheet data
   */
  constructor(
    private bottomSheetRef: MatBottomSheetRef<BottomSheetTextDetailsComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: BottomSheetTextDetailsData
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
