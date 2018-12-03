import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { APP_BASE_HREF, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FlexLayoutModule } from '@angular/flex-layout';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

/*
*	Some material components rely on hammerjs
*	CustomMaterialModule loads exact material modules
*/
import '../../node_modules/hammerjs/hammer.js';
import { CustomMaterialModule } from './modules/material/custom-material.module';

import { AppRoutingModule } from './app.routing.module';

import { AppComponent } from './app.component';
import { AppNavComponent } from './components/app-nav.component';
import { AppIndexComponent } from './components/app-index.component';
import { AppSinglesComponent } from './components/app-singles.component';
import { AppFreedownloadsComponent } from './components/app-freedownloads.component';
import { AppRepostsComponent } from './components/app-reposts.component';
import { AppBlogComponent } from './components/app-blog.component';
import { AppAboutComponent } from './components/app-about.component';
import { AppUserComponent } from './components/app-user.component';
import { AppAdminComponent } from './components/app-admin.component';

import { AppContactDialog } from './components/app-contact.component';
import { AppLoginDialog } from './components/app-login.component';

import { AnonymousGuard } from './services/anonymous-guard.service';

import { SoundcloudPlayerComponent } from './components/soundcloud-player.component';

import { TranslateModule } from './modules/translate/index';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { CustomServiceWorkerService } from './services/custom-service-worker.service';
import { CustomDeferredService } from './services/custom-deferred.service';
import { CustomHttpHandlersService } from './services/custom-http-handlers.service';
import { EventEmitterService } from './services/event-emitter.service';
import { UserInterfaceUtilsService } from './services/user-interface-utils.service';

import { FirebaseService } from './services/firebase.service';
import { SendEmailService } from './services/send-email.service';
import { GoogleApiService } from './services/google-api.service';
import { SoundcloudService } from './services/soundcloud.service';
import { FacebookService } from './services/facebook.service';
import { TwitterService } from './services/twitter.service';

import { IframeContentLoadedDirective } from './directives/iframe-content-loaded.directive';
import { ImageLoadedDirective } from './directives/image-loaded.directive';

import { ENV } from './app.environment';

/**
 * Main application module.
 */
@NgModule({
	declarations: [
		AppComponent, AppNavComponent, AppIndexComponent, AppSinglesComponent, AppFreedownloadsComponent,
		AppRepostsComponent, AppBlogComponent, AppAboutComponent, AppUserComponent, AppAdminComponent,
		SoundcloudPlayerComponent, AppContactDialog, AppLoginDialog,
		IframeContentLoadedDirective, ImageLoadedDirective
	],
	entryComponents: [
		AppContactDialog, AppLoginDialog
	],
	imports: [
		BrowserModule, BrowserAnimationsModule, FlexLayoutModule, CustomMaterialModule,
		FormsModule, ReactiveFormsModule, HttpClientModule, TranslateModule.forRoot(),
		AngularFireModule.initializeApp(ENV.firebase, 'dnbhub'), AngularFireDatabaseModule, AngularFireAuthModule,
		AppRoutingModule
	],
	providers: [
		{ provide: APP_BASE_HREF, useValue: '/' },
		{ provide: LocationStrategy, useClass: PathLocationStrategy },
		{ provide: 'Window', useValue: window }, { provide: ENV, useValue: ENV },
		CustomServiceWorkerService, CustomDeferredService, CustomHttpHandlersService,
		EventEmitterService, UserInterfaceUtilsService,
		FirebaseService, SendEmailService, GoogleApiService, SoundcloudService, FacebookService, TwitterService,
		AnonymousGuard
	],
	schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
