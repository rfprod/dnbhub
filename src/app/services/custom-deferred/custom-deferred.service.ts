import { Injectable } from '@angular/core';

/**
 * Custom deferred service.
 */
@Injectable({
  providedIn: 'root',
})
export class DnbhubCustomDeferredService<T> {
  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  public promise: Promise<T>;

  public resolve: (value?: T | PromiseLike<T>) => void;

  public reject: (reason?: any) => void;
}
