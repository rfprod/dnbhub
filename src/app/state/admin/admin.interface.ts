import { Observable } from 'rxjs';
import { DnbhubBrand, SoundcloudPlaylist } from 'src/app/interfaces';
import { IEmailMessage } from 'src/app/interfaces/admin';
import { IFirebaseUserRecord } from 'src/app/interfaces/firebase';
import { IActionPayload } from 'src/app/utils/ngxs.util';

export interface IDnbhubAdminStateModel {
  emails: IEmailMessage[];
  brands: DnbhubBrand[];
  users: IFirebaseUserRecord[];
  blogEntriesIDs: number[];
  selectedBrand: DnbhubBrand;
  selectedSubmission: SoundcloudPlaylist;
}

export type TDnbhubAdminPayload = IActionPayload<Partial<IDnbhubAdminStateModel>>;

export interface IDnbhubAdminService {
  emails$: Observable<IEmailMessage[]>;
  brands$: Observable<DnbhubBrand[]>;
  users$: Observable<IFirebaseUserRecord[]>;
  blogEntriesIDs$: Observable<number[]>;
  selectedBrand$: Observable<DnbhubBrand>;
  selectedSubmission$: Observable<SoundcloudPlaylist>;
}
