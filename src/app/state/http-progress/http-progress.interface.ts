import { StateToken } from '@ngxs/store';
import { MonoTypeOperatorFunction, Observable } from 'rxjs';

import { IActionPayload } from '../../utils/ngxs.util';

export interface IDnbhubHttpProgressStateModel {
  mainView: boolean;
}

export type TDnbhubHttpProgressPayload = IActionPayload<Partial<IDnbhubHttpProgressStateModel>>;

export interface IDnbhubHttpProgressService {
  mainView$: Observable<boolean>;
}

export interface IHttpProgressHandlersActions {
  start(): void;
  stop(): void;
  tapStopperObservable<T>(): MonoTypeOperatorFunction<T>;
}

export interface IHttpProgressHandlers {
  mainView: IHttpProgressHandlersActions;
}

export const HTTP_PROGRESS_STATE_TOKEN = new StateToken<IDnbhubHttpProgressStateModel>(
  'httpProgress',
);
