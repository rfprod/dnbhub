import { EventEmitter, Injectable } from '@angular/core';

/**
 * Event emitter service.
 */
@Injectable()
export class EventEmitterService {
  /**
   * Event emitter instance.
   */
  private readonly emitter: EventEmitter<any> = new EventEmitter();

  /**
   * Returns event emitter instance.
   */
  public getEmitter(): EventEmitter<any> {
    return this.emitter;
  }

  /**
   * Emits erbitrary event.
   */
  public emitEvent(object: object): void {
    this.emitter.emit(object);
  }
}
