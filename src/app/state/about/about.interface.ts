import { Observable } from 'rxjs';
import { IActionPayload } from 'src/app/utils/ngxs.util';

import { AboutDetails } from '../../interfaces/about/about-details.interface';

export interface IDnbhubAboutStateModel {
  details: AboutDetails;
}

export type TDnbhubAboutPayload = IActionPayload<Partial<IDnbhubAboutStateModel>>;

export interface IDnbhubAboutService {
  details$: Observable<AboutDetails>;
}
