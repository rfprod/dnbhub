import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { IActionPayload } from 'src/app/utils/ngxs.util';

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
