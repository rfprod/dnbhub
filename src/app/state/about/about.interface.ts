import { Observable } from 'rxjs';
import { IActionPayload } from 'src/app/utils/ngxs.util';

import { AboutDetails } from '../../interfaces/about/about-details.interface';

export interface IAboutStateModel {
  details: AboutDetails;
}

export type AboutPayload = IActionPayload<Partial<IAboutStateModel>>;

export interface IAboutService {
  details$: Observable<AboutDetails>;
}
