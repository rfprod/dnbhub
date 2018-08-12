import { Component, OnInit, OnDestroy, ElementRef, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { EventEmitterService } from '../services/event-emitter.service';
import { CustomServiceWorkerService } from '../services/custom-service-worker.service';
import { TranslateService } from '../modules/translate/index';

@Component({
	selector: 'app-nav',
	templateUrl: '/app/views/app-nav.html',
	host: {
		class: 'mat-body-1'
	}
})
export class AppNavComponent implements OnInit, OnDestroy {

	constructor(
		private el: ElementRef,
		private emitter: EventEmitterService,
		private serviceWorker: CustomServiceWorkerService,
		private router: Router,
		private translate: TranslateService,
		@Inject('Window') private window: Window
	) {}

	private subscriptions: any[] = [];

	public navButtonsState: boolean[] = [false, false, false, false, false, false, false, false];

	public supportedLanguages: any[] = [
		{ key: 'en', name: 'English' },
		{ key: 'ru', name: 'Russian' }
	];

	public switchNavButtons(event: any, path?: string): void {
		/*
		*	accepts router event, and optionally path which contains name of activated path
		*	if path parameter is passed, event parameter will be ignored
		*/
		let index: string;
		console.log('switchNavButtons:', event);
		const route: string = (event.route) ? event.route : (typeof event.urlAfterRedirects === 'string') ? event.urlAfterRedirects : event.url;
		// remove args from route if present
		path = (!path) ? route.replace(/\?.*$/, '').substring(route.lastIndexOf('/') + 1, route.length) : path;
		console.log(' >> PATH', path);
		if (path === 'index') {
			index = '0';
		} else if (path === 'singles') {
			index = '1';
		} else if (path === 'freedownloads') {
			index = '2';
		} else if (path === 'reposts') {
			index = '3';
		} else if (path === 'blog') {
			index = '4';
		} else if (path === 'user') {
			index = '5';
		} else if (path === 'admin') {
			index = '6';
		} else if (path === 'about') {
			index = '7';
		}
		for (const b in this.navButtonsState) {
			if (typeof this.navButtonsState[b] === 'boolean') {
				this.navButtonsState[b] = (b === index) ? true : false;
			}
		}
		console.log('navButtonsState:', this.navButtonsState);
	}

	public selectLanguage(key: string): void {
		this.emitter.emitEvent({lang: key});
	}
	public isLanguageSelected(key: string): boolean {
		return key === this.translate.currentLanguage;
	}

	public serviceWorkerRegistered: boolean = true; // registered by default
	public toggleServiceWorker(): void {
		if (this.serviceWorkerRegistered) {
			this.emitter.emitEvent({serviceWorker: 'deinitialize'});
		} else {
			this.emitter.emitEvent({serviceWorker: 'initialize'});
		}
	}

	private emitterSubscribe(): void {
		const sub: any = this.emitter.getEmitter().subscribe((event: any) => {
			console.log('AppNavComponent consuming event:', event);
			if (event.serviceWorker === 'registered') {
				this.serviceWorkerRegistered = true;
			} else if (event.serviceWorker === 'unregistered') {
				this.serviceWorkerRegistered = false;
			}
		});
		this.subscriptions.push(sub);
	}

	private routerSubscribe(): void {
		const sub: any = this.router.events.subscribe((event: any) => {
			// console.log(' > ROUTER EVENT:', event);
			if (event instanceof NavigationEnd) {
				console.log(' > ROUTER > NAVIGATION END, event', event);
				this.switchNavButtons(event);
			}
		});
		this.subscriptions.push(sub);
	}

	public ngOnInit(): void {
		console.log('ngOnInit: AppNavComponent initialized');
		this.emitterSubscribe();
		this.routerSubscribe();
	}

	public ngOnDestroy(): void {
		console.log('ngOnDestroy: AppNavComponent destroyed');
		if (this.subscriptions.length) {
			for (const sub of this.subscriptions) {
				sub.unsubscribe();
			}
		}
	}
}
