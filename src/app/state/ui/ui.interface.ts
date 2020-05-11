import { Observable } from 'rxjs';
import { ESUPPORTED_LANGUAGE_KEY } from 'src/app/modules';
import { IActionPayload } from 'src/app/utils/ngxs.util';

export interface IUiStateModel {
  darkThemeEnabled: boolean;
  language: ESUPPORTED_LANGUAGE_KEY;
  sidenavOpened: boolean;
}

export type UiPayload = IActionPayload<Partial<IUiStateModel>>;

export interface IUiService {
  darkThemeEnabled$: Observable<boolean>;
  language$: Observable<ESUPPORTED_LANGUAGE_KEY>;
  sidenavOpened$: Observable<boolean>;
}
