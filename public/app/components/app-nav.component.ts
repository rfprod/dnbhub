import { Component, OnInit, OnDestroy, ElementRef, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { EventEmitterService } from '../services/event-emitter.service';
import { CustomServiceWorkerService } from '../services/custom-service-worker.service';
import { TranslateService } from '../modules/translate/index';

/**
 * Application navigation component.
 */
@Component({
	selector: 'app-nav',
	templateUrl: '/app/views/app-nav.html',
	host: {
		class: 'mat-body-1'
	}
})
export class AppNavComponent implements OnInit, OnDestroy {

	/**
	 * @param el Element reference.
	 * @param emitter Event emitter service - components interaction.
	 * @param serviceWorker Service worker service.
	 * @param router Application router.
	 * @param window Window reference.
	 */
	constructor(
		private el: ElementRef,
		private emitter: EventEmitterService,
		private serviceWorker: CustomServiceWorkerService,
		private router: Router,
		private translateService: TranslateService,
		@Inject('Window') private window: Window
	) {}

	/**
	 * Component subscriptions.
	 */
	private subscriptions: any[] = [];

	/**
	 * Navigation buttons state.
	 */
	public navButtonsState: boolean[] = [false, false, false, false, false, false, false, false];

	/**
	 * Supported languages list.
	 */
	public supportedLanguages: any[] = [
		{ key: 'en', name: 'English' },
		{ key: 'ru', name: 'Russian' }
	];

	/**
	 * Switches navigation buttons.
	 */
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
		} else if (path === 'about') {
			index = '5';
		} else if (path === 'user') {
			index = '6';
		} else if (path === 'admin') {
			index = '7';
		}
		for (const b in this.navButtonsState) {
			if (typeof this.navButtonsState[b] === 'boolean') {
				this.navButtonsState[b] = (b === index) ? true : false;
			}
		}
		console.log('navButtonsState:', this.navButtonsState);
	}

	/**
	 * Selects language by key.
	 */
	public selectLanguage(key: string): void {
		this.emitter.emitEvent({lang: key});
	}
	/**
	 * Returns if current language is selected.
	 */
	public isLanguageSelected(key: string): boolean {
		return key === this.translateService.currentLanguage;
	}

	/**
	 * Service worker registration state.
	 */
	public serviceWorkerRegistered: boolean = true; // registered by default
	/**
	 * Toggles service worker.
	 */
	public toggleServiceWorker(): void {
		if (this.serviceWorkerRegistered) {
			this.emitter.emitEvent({serviceWorker: 'deinitialize'});
		} else {
			this.emitter.emitEvent({serviceWorker: 'initialize'});
		}
	}

	/**
	 * Subscribes to Event Emitter events.
	 */
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

	/**
	 * Subscribes to router events.
	 */
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

	/**
	 * Calls auth dialog.
	 */
	public showAuthDialog(): void {
		console.log('TODO:client show auth dialog');
	}

	/**
	 * Initialization lifecycle hook.
	 */
	public ngOnInit(): void {
		console.log('ngOnInit: AppNavComponent initialized');
		this.emitterSubscribe();
		this.routerSubscribe();
	}

	/**
	 * Destruction lifecycle hook.
	 */
	public ngOnDestroy(): void {
		console.log('ngOnDestroy: AppNavComponent destroyed');
		if (this.subscriptions.length) {
			for (const sub of this.subscriptions) {
				sub.unsubscribe();
			}
		}
	}
}
