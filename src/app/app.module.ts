import { APP_BASE_HREF, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsModule } from '@ngxs/store';
import { AppComponent } from 'src/app/app.component';
import { ENV } from 'src/app/app.environment';
import { AppRoutingModule } from 'src/app/app.routing.module';
import { AppAboutComponent } from 'src/app/components/app-about/app-about.component';
import { AppAdminComponent } from 'src/app/components/app-admin/app-admin.component';
import { AppBlogComponent } from 'src/app/components/app-blog/app-blog.component';
import { AppContactDialog } from 'src/app/components/app-contact/app-contact.component';
import { AppFreedownloadsComponent } from 'src/app/components/app-freedownloads/app-freedownloads.component';
import { AppIndexComponent } from 'src/app/components/app-index/app-index.component';
import { AppLoginDialog } from 'src/app/components/app-login/app-login.component';
import { AppNavComponent } from 'src/app/components/app-nav/app-nav.component';
import { AppRepostsComponent } from 'src/app/components/app-reposts/app-reposts.component';
import { AppSinglesComponent } from 'src/app/components/app-singles/app-singles.component';
import { AppUserComponent } from 'src/app/components/app-user/app-user.component';
import { SoundcloudPlayerComponent } from 'src/app/components/soundcloud-player/soundcloud-player.component';
import { IframeContentLoadedDirective } from 'src/app/directives/iframe-content-loaded/iframe-content-loaded.directive';
import { ImageLoadedDirective } from 'src/app/directives/image-loaded/image-loaded.directive';
import { CustomMaterialModule } from 'src/app/modules/material/custom-material.module';
import { TranslateModule } from 'src/app/modules/translate/index';
import { MapToIterablePipe } from 'src/app/pipes/map-to-iterable/map-to-iterable.pipe';
import { AnonymousGuard } from 'src/app/services/anonymous-guard/anonymous-guard.service';
import { CustomDeferredService } from 'src/app/services/custom-deferred/custom-deferred.service';
import { CustomHttpHandlersService } from 'src/app/services/custom-http-handlers/custom-http-handlers.service';
import { EmailSubmissionService } from 'src/app/services/email-submission/email-submission.service';
import { EmailSubscriptionService } from 'src/app/services/email-subscription/email-subscription.service';
import { EventEmitterService } from 'src/app/services/event-emitter/event-emitter.service';
import { FacebookService } from 'src/app/services/facebook/facebook.service';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { GoogleApiService } from 'src/app/services/google-api/google-api.service';
import { RegularExpressionsService } from 'src/app/services/regular-expressions/regular-expressions.service';
import { SendEmailService } from 'src/app/services/send-email/send-email.service';
import { SoundcloudService } from 'src/app/services/soundcloud/soundcloud.service';
import { TwitterService } from 'src/app/services/twitter/twitter.service';

import { BottomSheetTextDetailsComponent } from './components/bottom-sheet-text-details/bottom-sheet-text-details.component';
import { AppSpinnerService } from './services';
import { DnbhubStoreState } from './state/dnbhub-store.state';

/**
 * Main application module.
 */
@NgModule({
  declarations: [
    AppComponent,
    AppNavComponent,
    AppIndexComponent,
    AppSinglesComponent,
    AppFreedownloadsComponent,
    AppRepostsComponent,
    AppBlogComponent,
    AppAboutComponent,
    AppUserComponent,
    AppAdminComponent,
    SoundcloudPlayerComponent,
    AppContactDialog,
    AppLoginDialog,
    IframeContentLoadedDirective,
    ImageLoadedDirective,
    MapToIterablePipe,
    BottomSheetTextDetailsComponent,
  ],
  entryComponents: [AppContactDialog, AppLoginDialog, BottomSheetTextDetailsComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    CustomMaterialModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    AngularFireModule.initializeApp(ENV.firebase, 'dnbhub-a5d9c'),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    NgxsModule.forRoot([DnbhubStoreState]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
    AppRoutingModule,
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: 'Window', useValue: window },
    CustomDeferredService,
    CustomHttpHandlersService,
    EventEmitterService,
    SendEmailService,
    EmailSubmissionService,
    EmailSubscriptionService,
    FirebaseService,
    GoogleApiService,
    SoundcloudService,
    FacebookService,
    TwitterService,
    RegularExpressionsService,
    AppSpinnerService,
    AnonymousGuard,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
