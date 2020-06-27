import { Observable } from 'rxjs';
import { IActionPayload } from 'src/app/utils/ngxs.util';

import { DnbhubAboutDetails } from '../../interfaces/about/about-details.interface';

export interface IDnbhubAboutStateModel {
  details: DnbhubAboutDetails;
}

export type TDnbhubAboutPayload = IActionPayload<Partial<IDnbhubAboutStateModel>>;

export interface IDnbhubAboutService {
  details$: Observable<DnbhubAboutDetails>;
}
