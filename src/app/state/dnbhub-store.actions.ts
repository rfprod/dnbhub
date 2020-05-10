import { IAboutDetails } from 'src/app/interfaces/about/about-details.interface';

export class DnbhubStoreAction {
  public static readonly type = '[DnbhubStore] Update state';

  constructor(
    public payload: {
      details?: IAboutDetails;
    },
  ) {}
}
