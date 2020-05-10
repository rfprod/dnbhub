import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { BottomSheetTextDetailsData } from 'src/app/interfaces';

/**
 * Bottom sheet text details component.
 */
@Component({
  selector: 'app-bottom-sheet-text-details',
  templateUrl: './bottom-sheet-text-details.component.html',
  styleUrls: ['./bottom-sheet-text-details.component.scss'],
})
export class BottomSheetTextDetailsComponent {
  /**
   * BottomSheetTextDetailsComponent constructor.
   * @param bottomSheetRef bottom sheet reference
   * @param data bottom sheet data
   */
  constructor(
    private readonly bottomSheetRef: MatBottomSheetRef<BottomSheetTextDetailsComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: BottomSheetTextDetailsData,
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
