/**
 * Bottom sheet text details data.
 */
export class BottomSheetTextDetailsData {
  constructor(input?: BottomSheetTextDetailsData) {
    if (input) {
      this.text = input.text;
    }
  }

  public text: string = '';
}
