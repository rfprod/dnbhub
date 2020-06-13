import { Observable } from 'rxjs';
import { Brand, SoundcloudPlaylist } from 'src/app/interfaces';
import { IEmailMessage, IEmailSubmission } from 'src/app/interfaces/admin';
import { IFirebaseUserRecord } from 'src/app/interfaces/firebase';
import { IActionPayload } from 'src/app/utils/ngxs.util';

export interface IDnbhubAdminStateModel {
  emailSubmissions: IEmailSubmission[];
  emailMessages: IEmailMessage[];
  brands: Brand[];
  users: IFirebaseUserRecord[];
  blogEntriesIDs: number[];
  selectedBrand: Brand;
  selectedSubmission: SoundcloudPlaylist;
}

export type TDnbhubAdminPayload = IActionPayload<Partial<IDnbhubAdminStateModel>>;

export interface IDnbhubAdminService {
  emailSubmissions$: Observable<IEmailSubmission[]>;
  emailMessages$: Observable<IEmailMessage[]>;
  brands$: Observable<Brand[]>;
  users$: Observable<IFirebaseUserRecord[]>;
  blogEntriesIDs$: Observable<number[]>;
  selectedBrand$: Observable<Brand>;
  selectedSubmission$: Observable<SoundcloudPlaylist>;
}
