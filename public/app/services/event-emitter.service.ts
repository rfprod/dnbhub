import { Injectable, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable()
export class EventEmitterService {

	/**
	 * Event emitter instance.
	 */
	private emitter: EventEmitter<any> = new EventEmitter();

	/**
	 * Returns event emitter instance.
	 */
	public getEmitter(): EventEmitter<any>  {
		return this.emitter;
	}

	/**
	 * Emits erbitrary event.
	 */
	public emitEvent(object: object): void {
		this.emitter.emit(object);
	}

	/**
	 * Emits progress spinner start event.
	 */
	public emitSpinnerStartEvent(): void {
		console.log('root spinner start event emitted');
		this.emitter.emit({spinner: 'start'});
	}

	/**
	 * Emits progress spinner stop event.
	 */
	public emitSpinnerStopEvent(): void {
		console.log('root spinner stop event emitted');
		this.emitter.emit({spinner: 'stop'});
	}

	/**
	 * Emits progress bar start event.
	 * Progress pars should be used locally in dialogs and similar.
	 */
	public emitProgressStartEvent(): void {
		console.log('progress bar start event emitted');
		this.emitter.emit({progress: 'start'});
	}

	/**
	 * Emits progress bar stop event.
	 * Progress pars should be used locally in dialogs and similar.
	 */
	public emitProgressStopEvent(): void {
		console.log('progress bar stop event emitted');
		this.emitter.emit({progress: 'stop'});
	}

}
