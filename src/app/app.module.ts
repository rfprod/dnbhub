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
import { DnbhubRootComponent } from 'src/app/app.component';
import { DnbhubEnvironmentConfig, ENV } from 'src/app/app.environment';
import { DnbhubRoutingModule } from 'src/app/app.routing.module';
import { DnbhubAboutComponent } from 'src/app/components/about/about.component';
import { DnbhubAdminComponent } from 'src/app/components/admin/admin.component';
import { DnbhubBlogComponent } from 'src/app/components/blog/blog.component';
import { DnbhubContactDialogComponent } from 'src/app/components/contact-dialog/contact-dialog.component';
import { DnbhubFreedownloadsComponent } from 'src/app/components/freedownloads/freedownloads.component';
import { DnbhubIndexComponent } from 'src/app/components/index/index.component';
import { DnbhubLoginDialogComponent } from 'src/app/components/login-dialog/login-dialog.component';
import { DnbhubNavbarComponent } from 'src/app/components/navbar/navbar.component';
import { DnbhubRepostsComponent } from 'src/app/components/reposts/reposts.component';
import { DnbhubSinglesComponent } from 'src/app/components/singles/singles.component';
import { DnbhubSoundcloudPlayerComponent } from 'src/app/components/soundcloud-player/soundcloud-player.component';
import { DnbhubUserComponent } from 'src/app/components/user/user.component';
import { DnbhubMaterialModule } from 'src/app/modules/material/custom-material.module';
import { DnbhubTranslateModule } from 'src/app/modules/translate/index';
import { DnbhubMapToIterablePipe } from 'src/app/pipes/map-to-iterable/map-to-iterable.pipe';
import { environment } from 'src/environments/environment';

import { DnbhubBottomSheetTextDetailsComponent } from './components/bottom-sheet-text-details/bottom-sheet-text-details.component';
import { DnbhubBrandDialogComponent } from './components/brand-dialog/brand-dialog.component';
import { DnbhubProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { DnbhubToolbarComponent } from './components/toolbar/toolbar.component';
import { DnbhubAboutStoreModule } from './state/about/about.module';
import { DnbhubAdminStoreModule } from './state/admin/admin.module';
import { DnbhubBlogStoreModule } from './state/blog/blog.module';
import { DnbhubHttpProgressStoreModule } from './state/http-progress/http-progress.module';
import { DnbhubSoundcloudStoreModule } from './state/soundcloud/soundcloud.module';
import { DnbhubUiStoreModule } from './state/ui/ui.module';
import { APP_ENV, WINDOW } from './utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const entryComponenets: (any[] | Type<any>)[] = [
  DnbhubContactDialogComponent,
  DnbhubLoginDialogComponent,
  DnbhubBottomSheetTextDetailsComponent,
  DnbhubProgressBarComponent,
  DnbhubBrandDialogComponent,
];

/**
 * Main application module.
 */
@NgModule({
  declarations: [
    DnbhubRootComponent,
    DnbhubNavbarComponent,
    DnbhubToolbarComponent,
    DnbhubIndexComponent,
    DnbhubSinglesComponent,
    DnbhubFreedownloadsComponent,
    DnbhubRepostsComponent,
    DnbhubBlogComponent,
    DnbhubAboutComponent,
    DnbhubUserComponent,
    DnbhubAdminComponent,
    DnbhubSoundcloudPlayerComponent,
    DnbhubContactDialogComponent,
    DnbhubBrandDialogComponent,
    DnbhubLoginDialogComponent,
    DnbhubMapToIterablePipe,
    DnbhubBottomSheetTextDetailsComponent,
    DnbhubProgressBarComponent,
  ],
  entryComponents: [...entryComponenets],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    DnbhubMaterialModule.forRoot(),
    DnbhubTranslateModule.forRoot(),
    AngularFireModule.initializeApp(ENV.firebase, 'dnbhub-a5d9c'),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    NgxsModule.forRoot([], { developmentMode: !environment.production }),
    NgxsRouterPluginModule.forRoot(),
    NgxsFormPluginModule.forRoot(),
    environment.production ? null : NgxsReduxDevtoolsPluginModule.forRoot(),
    environment.production ? null : NgxsLoggerPluginModule.forRoot(),
    DnbhubUiStoreModule.forRoot(),
    DnbhubHttpProgressStoreModule.forRoot(),
    DnbhubSoundcloudStoreModule.forRoot(),
    DnbhubBlogStoreModule.forRoot(),
    DnbhubAboutStoreModule.forRoot(),
    DnbhubAdminStoreModule.forRoot(),
    DnbhubRoutingModule,
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: WINDOW, useValue: window },
    { provide: APP_ENV, useFactory: () => new DnbhubEnvironmentConfig() },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [DnbhubRootComponent],
})
export class DnbhubModule {}
