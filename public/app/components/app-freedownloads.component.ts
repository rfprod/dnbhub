import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';

import { EventEmitterService } from '../services/event-emitter.service';

@Component({
	selector: 'app-freedownloads',
	templateUrl: '/app/views/app-freedownloads.html',
	host: {
		class: 'mat-body-1'
	}
})
export class AppFreedownloadsComponent implements OnInit, OnDestroy {

	/**
	 * @param emitter Event emitter service
	 */
	constructor(
		private emitter: EventEmitterService
	) {}

	@HostBinding('fxLayout') public fxLayout: string = 'row';
	@HostBinding('fxLayoutAlign') public fxLayoutAlign: string = 'start stretch';

	/**
	 * Should be called once iframe content finished loading.
	 */
	public contentLoaded(): void {
		console.log('content loaded');
		this.emitter.emitSpinnerStopEvent();
	}

	public details: any = {};

	public ngOnInit(): void {
		console.log('ngOnInit: AppFreedownloadsComponent initialized');
		this.emitter.emitSpinnerStartEvent();
	}

	public ngOnDestroy(): void {
		console.log('ngOnDestroy: AppFreedownloadsComponent destroyed');
	}
}
