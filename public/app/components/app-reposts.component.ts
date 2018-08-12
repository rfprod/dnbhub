import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';

import { EventEmitterService } from '../services/event-emitter.service';

@Component({
	selector: 'app-reposts',
	templateUrl: '/app/views/app-reposts.html',
	host: {
		class: 'mat-body-1'
	}
})
export class AppRepostsComponent implements OnInit, OnDestroy {

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
		console.log('ngOnInit: AppRepostsComponent initialized');
	}

	public ngOnDestroy(): void {
		console.log('ngOnDestroy: AppRepostsComponent destroyed');
	}
}
