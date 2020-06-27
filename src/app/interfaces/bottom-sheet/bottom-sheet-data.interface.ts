/**
 * Bottom sheet text details data.
 */
export class DnbhubBottomSheetTextDetailsData {
  constructor(input?: DnbhubBottomSheetTextDetailsData) {
    if (Boolean(input)) {
      this.text = input.text;
    }
  }

  public text = '';
}
