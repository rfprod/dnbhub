import { APP_BASE_HREF, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, Type } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsModule } from '@ngxs/store';
import { AppComponent } from 'src/app/app.component';
import { AppEnvironmentConfig, ENV } from 'src/app/app.environment';
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
import { AuthenticatedGuard } from 'src/app/guards/authenticated/authenticated.guard';
import { CustomMaterialModule } from 'src/app/modules/material/custom-material.module';
import { TranslateModule } from 'src/app/modules/translate/index';
import { MapToIterablePipe } from 'src/app/pipes/map-to-iterable/map-to-iterable.pipe';
import { CustomDeferredService } from 'src/app/services/custom-deferred/custom-deferred.service';
import { EmailSubmissionService } from 'src/app/services/email-submission/email-submission.service';
import { FacebookService } from 'src/app/services/facebook/facebook.service';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { GoogleApiService } from 'src/app/services/google-api/google-api.service';
import { HttpHandlersService } from 'src/app/services/http-handlers/http-handlers.service';
import { RegularExpressionsService } from 'src/app/services/regular-expressions/regular-expressions.service';
import { SendEmailService } from 'src/app/services/send-email/send-email.service';
import { TwitterService } from 'src/app/services/twitter/twitter.service';
import { SoundcloudApiService } from 'src/app/state/soundcloud/soundcloud-api.service';
import { environment } from 'src/environments/environment';

import { AppToolbarComponent } from './components/app-toolbar/app-toolbar.component';
import { BottomSheetTextDetailsComponent } from './components/bottom-sheet-text-details/bottom-sheet-text-details.component';
import { IndeterminateProgressBarComponent } from './components/progress/indeterminate-progress-bar.component.ts/indeterminate-progress-bar.component';
import { AboutStoreModule } from './state/about/about.module';
import { BlogStoreModule } from './state/blog/blog.module';
import { HttpProgressStoreModule } from './state/http-progress/http-progress.module';
import { SoundcloudStoreModule } from './state/soundcloud/soundcloud.module';
import { UiStoreModule } from './state/ui/ui.module';
import { APP_ENV, WINDOW } from './utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const entryComponenets: (any[] | Type<any>)[] = [
  AppContactDialog,
  AppLoginDialog,
  BottomSheetTextDetailsComponent,
  IndeterminateProgressBarComponent,
];

/**
 * Main application module.
 */
@NgModule({
  declarations: [
    AppComponent,
    AppNavComponent,
    AppToolbarComponent,
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
    IndeterminateProgressBarComponent,
  ],
  entryComponents: [...entryComponenets],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CustomMaterialModule.forRoot(),
    TranslateModule.forRoot(),
    AngularFireModule.initializeApp(ENV.firebase, 'dnbhub-a5d9c'),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    NgxsModule.forRoot([], { developmentMode: !environment.production }),
    NgxsRouterPluginModule.forRoot(),
    NgxsFormPluginModule.forRoot(),
    environment.production ? null : NgxsReduxDevtoolsPluginModule.forRoot(),
    environment.production ? null : NgxsLoggerPluginModule.forRoot(),
    UiStoreModule.forRoot(),
    HttpProgressStoreModule.forRoot(),
    SoundcloudStoreModule.forRoot(),
    BlogStoreModule.forRoot(),
    AboutStoreModule.forRoot(),
    AppRoutingModule,
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: WINDOW, useValue: window },
    { provide: APP_ENV, useFactory: () => new AppEnvironmentConfig() },
    CustomDeferredService,
    HttpHandlersService,
    SendEmailService,
    EmailSubmissionService,
    FirebaseService,
    GoogleApiService,
    SoundcloudApiService,
    FacebookService,
    TwitterService,
    RegularExpressionsService,
    AuthenticatedGuard,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
