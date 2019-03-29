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
import 'node_modules/hammerjs/hammer.js';
import { CustomMaterialModule } from 'src/app/modules/material/custom-material.module';

import { AppRoutingModule } from 'src/app/app.routing.module';

import { AppComponent } from 'src/app/app.component';
import { AppNavComponent } from 'src/app/components/app-nav/app-nav.component';
import { AppIndexComponent } from 'src/app/components/app-index/app-index.component';
import { AppSinglesComponent } from 'src/app/components/app-singles/app-singles.component';
import { AppFreedownloadsComponent } from 'src/app/components/app-freedownloads/app-freedownloads.component';
import { AppRepostsComponent } from 'src/app/components/app-reposts/app-reposts.component';
import { AppBlogComponent } from 'src/app/components/app-blog/app-blog.component';
import { AppAboutComponent } from 'src/app/components/app-about/app-about.component';
import { AppUserComponent } from 'src/app/components/app-user/app-user.component';
import { AppAdminComponent } from 'src/app/components/app-admin/app-admin.component';

import { AppContactDialog } from 'src/app/components/app-contact/app-contact.component';
import { AppLoginDialog } from 'src/app/components/app-login/app-login.component';

import { AnonymousGuard } from 'src/app/services/anonymous-guard/anonymous-guard.service';

import { SoundcloudPlayerComponent } from 'src/app/components/soundcloud-player/soundcloud-player.component';

import { TranslateModule } from 'src/app/modules/translate/index';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { CustomServiceWorkerService } from 'src/app/services/custom-service-worker/custom-service-worker.service';
import { CustomDeferredService } from 'src/app/services/custom-deferred/custom-deferred.service';
import { CustomHttpHandlersService } from 'src/app/services/custom-http-handlers/custom-http-handlers.service';
import { EventEmitterService } from 'src/app/services/event-emitter/event-emitter.service';
import { UserInterfaceUtilsService } from 'src/app/services/user-interface-utils/user-interface-utils.service';

import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { SendEmailService } from 'src/app/services/send-email/send-email.service';
import { GoogleApiService } from 'src/app/services/google-api/google-api.service';
import { SoundcloudService } from 'src/app/services/soundcloud/soundcloud.service';
import { FacebookService } from 'src/app/services/facebook/facebook.service';
import { TwitterService } from 'src/app/services/twitter/twitter.service';
import { RegularExpressionsService } from 'src/app/services/regular-expressions/regular-expressions.service';

import { IframeContentLoadedDirective } from 'src/app/directives/iframe-content-loaded/iframe-content-loaded.directive';
import { ImageLoadedDirective } from 'src/app/directives/image-loaded/image-loaded.directive';

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
    AngularFireModule.initializeApp(ENV.firebase, 'dnbhub-a5d9c'), AngularFireDatabaseModule, AngularFireAuthModule,
    AppRoutingModule
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: 'Window', useValue: window },
    CustomServiceWorkerService, CustomDeferredService, CustomHttpHandlersService,
    EventEmitterService, UserInterfaceUtilsService,
    FirebaseService, SendEmailService, GoogleApiService, SoundcloudService, FacebookService, TwitterService, RegularExpressionsService,
    AnonymousGuard
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
