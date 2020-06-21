/**
 * Bottom sheet text details data.
 */
export class BottomSheetTextDetailsData {
  constructor(input?: BottomSheetTextDetailsData) {
    if (Boolean(input)) {
      this.text = input.text;
    }
  }

  public text = '';
}
