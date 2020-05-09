import { Observable } from 'rxjs';
import { IActionPayload } from 'src/app/utils/ngxs.util';

export interface IUiStateModel {
  darkThemeEnabled: boolean;
  sidenavOpened: boolean;
}

export type UiPayload = IActionPayload<Partial<IUiStateModel>>;

export interface IUiService {
  darkThemeEnabled$: Observable<boolean>;
  sidebavOpened$: Observable<boolean>;
}
