import { Observable } from 'rxjs';
import { Brand, SoundcloudPlaylist } from 'src/app/interfaces';
import { IEmailMessage } from 'src/app/interfaces/admin';
import { IFirebaseUserRecord } from 'src/app/interfaces/firebase';
import { IActionPayload } from 'src/app/utils/ngxs.util';

export interface IDnbhubAdminStateModel {
  emails: IEmailMessage[];
  brands: Brand[];
  users: IFirebaseUserRecord[];
  blogEntriesIDs: number[];
  selectedBrand: Brand;
  selectedSubmission: SoundcloudPlaylist;
}

export type TDnbhubAdminPayload = IActionPayload<Partial<IDnbhubAdminStateModel>>;

export interface IDnbhubAdminService {
  emails$: Observable<IEmailMessage[]>;
  brands$: Observable<Brand[]>;
  users$: Observable<IFirebaseUserRecord[]>;
  blogEntriesIDs$: Observable<number[]>;
  selectedBrand$: Observable<Brand>;
  selectedSubmission$: Observable<SoundcloudPlaylist>;
}
