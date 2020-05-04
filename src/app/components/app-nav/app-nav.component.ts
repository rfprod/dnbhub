import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { NavigationEnd, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AppLoginDialog } from 'src/app/components/app-login/app-login.component';
import { TranslateService } from 'src/app/modules/translate/index';
import { EventEmitterService } from 'src/app/services/event-emitter/event-emitter.service';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';

/**
 * Application navigation component.
 */
@UntilDestroy()
@Component({
  selector: 'app-nav',
  templateUrl: './app-nav.component.html',
  host: {
    class: 'mat-body-1',
  },
})
export class AppNavComponent implements OnInit, OnDestroy {
  /**
   * @param emitter Event emitter service - components interaction.
   * @param router Application router.
   * @param dialog Material dialog.
   * @param translateService Translate service
   * @param firebaseService Firebase service
   */
  constructor(
    private readonly emitter: EventEmitterService,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly translateService: TranslateService,
    private readonly firebaseService: FirebaseService,
  ) {}

  /**
   * Navigation buttons state.
   */
  public navButtonsState: boolean[] = [false, false, false, false, false, false, false, false];

  /**
   * Supported languages list.
   */
  public supportedLanguages: any[] = [
    { key: 'en', name: 'English' },
    { key: 'ru', name: 'Russian' },
  ];

  /**
   * Switches navigation buttons.
   */
  public switchNavButtons(event: any, path?: string): void {
    /**
     * accepts router event, and optionally path which contains name of activated path
     * if path parameter is passed, event parameter will be ignored
     */
    let index: string;
    console.log('switchNavButtons:', event);
    const route: string = event.route
      ? event.route
      : typeof event.urlAfterRedirects === 'string'
      ? event.urlAfterRedirects
      : event.url;
    // remove args from route if present
    path = !path
      ? route.replace(/\?.*$/, '').substring(route.lastIndexOf('/') + 1, route.length)
      : path;
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
        this.navButtonsState[b] = b === index ? true : false;
      }
    }
    console.log('navButtonsState:', this.navButtonsState);
  }

  /**
   * Selects language by key.
   */
  public selectLanguage(key: string): void {
    this.emitter.emitEvent({ lang: key });
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
  public serviceWorkerRegistered = true; // registered by default
  /**
   * Toggles service worker.
   */
  public toggleServiceWorker(): void {
    if (this.serviceWorkerRegistered) {
      this.emitter.emitEvent({ serviceWorker: 'deinitialize' });
    } else {
      this.emitter.emitEvent({ serviceWorker: 'initialize' });
    }
  }

  /**
   * Subscribes to Event Emitter events.
   */
  private emitterSubscribe(): void {
    this.emitter
      .getEmitter()
      .pipe(untilDestroyed(this))
      .subscribe((event: any) => {
        console.log('AppNavComponent consuming event:', event);
        if (event.serviceWorker === 'registered') {
          this.serviceWorkerRegistered = true;
        } else if (event.serviceWorker === 'unregistered') {
          this.serviceWorkerRegistered = false;
        }
      });
  }

  /**
   * Subscribes to router events.
   */
  private routerSubscribe(): void {
    this.router.events.pipe(untilDestroyed(this)).subscribe((event: any) => {
      // console.log(' > ROUTER EVENT:', event);
      if (event instanceof NavigationEnd) {
        console.log(' > ROUTER > NAVIGATION END, event', event);
        this.switchNavButtons(event);
      }
    });
  }

  /**
   * Calls auth dialog.
   */
  public showAuthDialog(): void {
    console.log('TODO:client show auth dialog');
    const dialogRef: MatDialogRef<AppLoginDialog> = this.dialog.open(AppLoginDialog, {
      data: {},
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('AppLoginDialog closed with result', result);
    });
  }

  /**
   * Signs user out.
   */
  public logout(): void {
    this.firebaseService.signout();
    this.router.navigate(['/index']);
  }

  /**
   * Insicates if user is anonymous.
   */
  public anonUser(): boolean {
    return this.firebaseService.anonUser();
  }

  /**
   * Indicates if user had admin role.
   */
  public isAdmin(): boolean {
    return this.firebaseService.privilegedAccess();
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
  }
}
