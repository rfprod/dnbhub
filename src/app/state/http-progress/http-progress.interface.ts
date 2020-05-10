import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { IActionPayload } from 'src/app/utils/ngxs.util';

export interface IHttpProgressStateModel {
  mainView: boolean;
}

export type HttpProgressPayload = IActionPayload<Partial<IHttpProgressStateModel>>;

export interface IHttpProgressService {
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
