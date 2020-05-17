import { Observable } from 'rxjs';
import { Brand } from 'src/app/interfaces';
import { IEmailMessage, IEmailSubmission } from 'src/app/interfaces/admin';
import { IFirebaseUserRecord } from 'src/app/interfaces/firebase';
import { IActionPayload } from 'src/app/utils/ngxs.util';

export interface IAdminStateModel {
  emailSubmissions: IEmailSubmission[];
  emailMessages: IEmailMessage[];
  brands: Brand[];
  users: IFirebaseUserRecord[];
  blogEntriesIDs: number[];
}

export type AdminPayload = IActionPayload<Partial<IAdminStateModel>>;

export interface IAdminService {
  emailSubmissions$: Observable<IEmailSubmission[]>;
  emailMessages$: Observable<IEmailMessage[]>;
  brands$: Observable<Brand[]>;
  users$: Observable<IFirebaseUserRecord[]>;
  blogEntriesIDs$: Observable<number[]>;
}
