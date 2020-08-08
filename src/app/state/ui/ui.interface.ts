import { Observable } from 'rxjs';
import { ESUPPORTED_LANGUAGE_KEY } from 'src/app/modules/translate/translations.interface';
import { IActionPayload } from 'src/app/utils/ngxs.util';

export interface IDnbhubUiStateModel {
  darkThemeEnabled: boolean;
  language: ESUPPORTED_LANGUAGE_KEY;
  sidenavOpened: boolean;
}

export type TDnbhubUiPayload = IActionPayload<Partial<IDnbhubUiStateModel>>;

export interface IDnbhubUiService {
  darkThemeEnabled$: Observable<boolean>;
  language$: Observable<ESUPPORTED_LANGUAGE_KEY>;
  sidenavOpened$: Observable<boolean>;
}
