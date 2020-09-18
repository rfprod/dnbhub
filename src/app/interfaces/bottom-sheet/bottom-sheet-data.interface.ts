/**
 * Bottom sheet text details data.
 */
export class DnbhubBottomSheetTextDetailsData {
  constructor(input?: DnbhubBottomSheetTextDetailsData) {
    if (typeof input !== 'undefined') {
      this.text = input.text;
    }
  }

  public text = '';
}
