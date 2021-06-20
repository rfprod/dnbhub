import { StateToken } from '@ngxs/store';
import { Observable } from 'rxjs';

import { SUPPORTED_LANGUAGE_KEY } from '../../modules/translate/translations.interface';
import { IActionPayload } from '../../utils/ngxs.util';

export interface IDnbhubUiStateModel {
  darkThemeEnabled: boolean;
  language: SUPPORTED_LANGUAGE_KEY;
  sidenavOpened: boolean;
}

export type TDnbhubUiPayload = IActionPayload<Partial<IDnbhubUiStateModel>>;

export interface IDnbhubUiService {
  darkThemeEnabled$: Observable<boolean>;
  language$: Observable<SUPPORTED_LANGUAGE_KEY>;
  sidenavOpened$: Observable<boolean>;
}

export const UI_STATE_TOKEN = new StateToken<IDnbhubUiStateModel>('ui');
