import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Provider } from '@angular/core';
import { Store } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { IndeterminateProgressBarComponent } from 'src/app/components/progress/indeterminate-progress-bar.component.ts/indeterminate-progress-bar.component';

import {
  IHttpProgressHandlers,
  IHttpProgressService,
  IHttpProgressStateModel,
} from './http-progress.interface';
import { httpProgressActions, HttpProgressState } from './http-progress.store';

@Injectable({
  providedIn: 'root',
})
export class HttpProgressService implements IHttpProgressService {
  public readonly mainView$ = this.store.select(HttpProgressState.mainViewProgress);

  public readonly handlers: IHttpProgressHandlers = {
    mainView: {
      start: () => this.startProgress(this.newHttpProgressState(true)),
      stop: () => this.stopProgress(this.newHttpProgressState(false)),
      tapStopperObservable: <Any>() => {
        return tap<Any>(
          _ => {
            this.handlers.mainView.stop();
          },
          _ => {
            this.handlers.mainView.stop();
          },
        );
      },
    },
  };

  constructor(private readonly store: Store, private readonly progressRef: OverlayRef) {}

  private newHttpProgressState(mainView?: boolean): Partial<IHttpProgressStateModel> {
    const payload: Partial<IHttpProgressStateModel> =
      typeof mainView === 'boolean' ? { mainView } : {};
    return payload;
  }

  private attachIndicator(): void {
    const portal = new ComponentPortal<IndeterminateProgressBarComponent>(
      IndeterminateProgressBarComponent,
    );
    this.progressRef.attach(portal);
  }

  private detachIndicator(): void {
    this.progressRef.detach();
  }

  private startProgress(payload: Partial<IHttpProgressStateModel>) {
    if (payload.mainView === true) {
      this.attachIndicator();
    }
    return this.store.dispatch(new httpProgressActions.startProgress(payload));
  }

  private stopProgress(payload: Partial<IHttpProgressStateModel>) {
    if (payload.mainView === false) {
      this.detachIndicator();
    }
    return this.store.dispatch(new httpProgressActions.stopProgress(payload));
  }
}

/**
 * Http progress service factory constructor.
 */
export type HttpProgressServiceFactoryConstructor = (
  store: Store,
  overlay: Overlay,
) => HttpProgressService;

/**
 * Http progress service factory.
 */
export const httpProgressServiceFactory: HttpProgressServiceFactoryConstructor = (
  store: Store,
  overlay: Overlay,
) => {
  const progressRef: OverlayRef = overlay.create({
    hasBackdrop: true,
    positionStrategy: overlay.position().global().top().width('100%').centerHorizontally(),
  });
  return new HttpProgressService(store, progressRef);
};

/**
 * Http progress service provider.
 */
export const httpProgressServiceProvider: Provider = {
  provide: HttpProgressService,
  useFactory: httpProgressServiceFactory,
  deps: [Store, Overlay],
};
