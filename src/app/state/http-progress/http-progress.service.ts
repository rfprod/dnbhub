import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Provider } from '@angular/core';
import { Store } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { DnbhubProgressBarComponent } from 'src/app/components/progress-bar/progress-bar.component';

import {
  IDnbhubHttpProgressService,
  IDnbhubHttpProgressStateModel,
  IHttpProgressHandlers,
} from './http-progress.interface';
import { DnbhubHttpProgressState, httpProgressActions } from './http-progress.store';

@Injectable({
  providedIn: 'root',
})
export class DnbhubHttpProgressService implements IDnbhubHttpProgressService {
  public readonly mainView$ = this.store.select(DnbhubHttpProgressState.mainViewProgress);

  public readonly handlers: IHttpProgressHandlers = {
    mainView: {
      start: () => this.startProgress(this.newDnbhubHttpProgressState(true)),
      stop: () => this.stopProgress(this.newDnbhubHttpProgressState(false)),
      tapStopperObservable: <Any>() => {
        return tap<Any>(
          () => {
            this.handlers.mainView.stop();
          },
          () => {
            this.handlers.mainView.stop();
          },
        );
      },
    },
  };

  constructor(private readonly store: Store, private readonly progressRef: OverlayRef) {}

  private newDnbhubHttpProgressState(mainView?: boolean): Partial<IDnbhubHttpProgressStateModel> {
    const payload: Partial<IDnbhubHttpProgressStateModel> =
      typeof mainView === 'boolean' ? { mainView } : {};
    return payload;
  }

  private attachIndicator(): void {
    const portal = new ComponentPortal<DnbhubProgressBarComponent>(DnbhubProgressBarComponent);
    if (!this.progressRef.hasAttached()) {
      this.progressRef.attach(portal);
    }
  }

  private detachIndicator(): void {
    if (this.progressRef.hasAttached()) {
      this.progressRef.detach();
    }
  }

  private startProgress(payload: Partial<IDnbhubHttpProgressStateModel>) {
    if (typeof payload.mainView !== 'undefined') {
      this.attachIndicator();
    }
    return this.store.dispatch(new httpProgressActions.startProgress(payload));
  }

  private stopProgress(payload: Partial<IDnbhubHttpProgressStateModel>) {
    if (typeof payload.mainView !== 'undefined') {
      this.detachIndicator();
    }
    return this.store.dispatch(new httpProgressActions.stopProgress(payload));
  }
}

/**
 * Http progress service factory constructor.
 */
export type TDnbhubHttpProgressServiceFactoryConstructor = (
  store: Store,
  overlay: Overlay,
) => DnbhubHttpProgressService;

/**
 * Http progress service factory.
 */
export const httpProgressServiceFactory: TDnbhubHttpProgressServiceFactoryConstructor = (
  store: Store,
  overlay: Overlay,
) => {
  const progressRef: OverlayRef = overlay.create({
    hasBackdrop: true,
    positionStrategy: overlay.position().global().top().width('100%').centerHorizontally(),
  });
  return new DnbhubHttpProgressService(store, progressRef);
};

/**
 * Http progress service provider.
 */
export const httpProgressServiceProvider: Provider = {
  provide: DnbhubHttpProgressService,
  useFactory: httpProgressServiceFactory,
  deps: [Store, Overlay],
};
