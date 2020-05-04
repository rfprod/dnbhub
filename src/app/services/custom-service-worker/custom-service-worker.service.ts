import { Inject, Injectable } from '@angular/core';
import { CustomDeferredService } from 'src/app/services/custom-deferred/custom-deferred.service';
import { EventEmitterService } from 'src/app/services/event-emitter/event-emitter.service';

/**
 * Custom service worker service.
 */
@Injectable()
export class CustomServiceWorkerService {
  constructor(
    private readonly emitter: EventEmitterService,
    @Inject('Window') private readonly window: Window,
  ) {
    console.warn('CustomServiceWorkerService init');
    this.initializeServiceWorker();
  }

  private readonly serviceWorker: any = this.window.navigator.serviceWorker;

  private serviceWorkerRegistration: any;

  private registerServiceWorker(): Promise<boolean> {
    const def = new CustomDeferredService<boolean>();
    if (this.serviceWorker) {
      console.warn('serviceWorker exists in navigator, checking registrations');
      this.serviceWorker.getRegistrations().then((registrations: any) => {
        console.warn('serviceWorker registrations', registrations);
        if (registrations.length) {
          console.warn('service worker update');
          registrations[0].update();
          this.serviceWorkerRegistration = registrations[0];
          def.resolve();
        } else {
          this.serviceWorker
            .register('/service-worker.js', {
              scope: '/',
            })
            .then((registration: any) => {
              console.warn('serviceWorker registration completed, registration:', registration);
              this.serviceWorkerRegistration = registration;
              def.resolve();
            });
        }
      });
    } else {
      console.warn('serviceWorker does not exist in navigator');
      def.reject();
    }
    return def.promise;
  }

  private unregisterServiceWorker(): Promise<boolean> {
    const def = new CustomDeferredService<boolean>();
    if (this.serviceWorker) {
      this.serviceWorker.getRegistrations().then((registrations: any) => {
        console.warn('removing registrations', registrations);
        return Promise.all(registrations.map((item: any) => item.unregister())).then(() => {
          console.warn('serviceWorker unregistered');
          def.resolve();
        });
      });
      this.serviceWorkerRegistration = undefined;
    } else {
      console.warn('serviceWorker does not exist in navigator');
      def.resolve();
    }
    return def.promise;
  }

  private emitterSubscription: any;

  private emitterSubscribe(): void {
    this.emitterSubscription = this.emitter.getEmitter().subscribe((event: any) => {
      console.warn('CustomServiceWorkerService consuming event:', JSON.stringify(event));
      if (event.serviceWorker === 'initialize') {
        this.initializeServiceWorker();
      } else if (event.serviceWorker === 'deinitialize') {
        this.deinitializeServiceWorker();
      }
    });
  }

  private emitterUnsubscribe(): void {
    this.emitterSubscription.unsubscribe();
  }

  public initializeServiceWorker(): void {
    this.registerServiceWorker()
      .then(() => {
        this.emitterSubscribe();
        this.emitter.emitEvent({ serviceWorker: 'registered' });
      })
      .catch(() => {
        this.emitter.emitEvent({ serviceWorker: 'unregistered' });
      });
  }

  private deinitializeServiceWorker(): void {
    this.unregisterServiceWorker().then(() => {
      this.emitter.emitEvent({ serviceWorker: 'unregistered' });
    });
  }

  public disableServiceWorker(): void {
    this.unregisterServiceWorker().then(() => {
      this.emitterUnsubscribe();
      this.emitter.emitEvent({ serviceWorker: 'unregistered' });
    });
  }

  public isServiceWorkerRegistered(): boolean {
    return this.serviceWorker && typeof this.serviceWorkerRegistration !== 'undefined';
  }
}
