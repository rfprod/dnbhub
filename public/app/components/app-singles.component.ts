import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';

import { EventEmitterService } from '../services/event-emitter.service';

@Component({
	selector: 'app-singles',
	templateUrl: '/app/views/app-singles.html',
	host: {
		class: 'mat-body-1'
	}
})
export class AppSinglesComponent implements OnInit, OnDestroy {

	/**
	 * @param emitter Event emitter service
	 */
	constructor(
		private emitter: EventEmitterService
	) {}

	@HostBinding('fxLayout') public fxLayout: string = 'row';
	@HostBinding('fxLayoutAlign') public fxLayoutAlign: string = 'start stretch';

	public details: any = {};

	public ngOnInit(): void {
		console.log('ngOnInit: AppSinglesComponent initialized');
		// this.emitter.emitSpinnerStartEvent();
	}

	public ngOnDestroy(): void {
		console.log('ngOnDestroy: AppSinglesComponent destroyed');
	}
}
