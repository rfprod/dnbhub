import { Observable } from 'rxjs';
import { Brand } from 'src/app/interfaces';
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
}

export type TDnbhubAdminPayload = IActionPayload<Partial<IDnbhubAdminStateModel>>;

export interface IDnbhubAdminService {
  emailSubmissions$: Observable<IEmailSubmission[]>;
  emailMessages$: Observable<IEmailMessage[]>;
  brands$: Observable<Brand[]>;
  users$: Observable<IFirebaseUserRecord[]>;
  blogEntriesIDs$: Observable<number[]>;
  selectedBrand$: Observable<Brand>;
}
