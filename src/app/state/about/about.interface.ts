import { StateToken } from '@ngxs/store';
import { Observable } from 'rxjs';

import { DnbhubAboutDetails } from '../../interfaces/about/about-details.interface';
import { IActionPayload } from '../../utils/ngxs.util';

export interface IDnbhubAboutStateModel {
  details: DnbhubAboutDetails;
}

export type TDnbhubAboutPayload = IActionPayload<Partial<IDnbhubAboutStateModel>>;

export interface IDnbhubAboutService {
  details$: Observable<DnbhubAboutDetails>;
}

export const ABOUT_STATE_TOKEN = new StateToken<IDnbhubAboutStateModel>('about');
