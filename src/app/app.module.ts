import { APP_BASE_HREF, DOCUMENT, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsLoggerPluginModule, NgxsLoggerPluginOptions } from '@ngxs/logger-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsModule } from '@ngxs/store';
import { DnbhubEnvironmentConfig, ENV } from 'src/app/app.environment';
import { DnbhubRoutingModule } from 'src/app/app-routing.module';
import { DnbhubAboutComponent } from 'src/app/components/about/about.component';
import { DnbhubAdminComponent } from 'src/app/components/admin/admin.component';
import { DnbhubBlogComponent } from 'src/app/components/blog/blog.component';
import { DnbhubContactDialogComponent } from 'src/app/components/contact-dialog/contact-dialog.component';
import { DnbhubIndexComponent } from 'src/app/components/index/index.component';
import { DnbhubLoginDialogComponent } from 'src/app/components/login-dialog/login-dialog.component';
import { DnbhubNavbarComponent } from 'src/app/components/navbar/navbar.component';
import { DnbhubRootComponent } from 'src/app/components/root/root.component';
import { DnbhubSoundcloudPlayerComponent } from 'src/app/components/soundcloud-player/soundcloud-player.component';
import { DnbhubUserComponent } from 'src/app/components/user/user.component';
import { DnbhubMaterialModule } from 'src/app/modules/material/custom-material.module';
import { DnbhubTranslateModule } from 'src/app/modules/translate/index';
import { DnbhubMapToIterablePipe } from 'src/app/pipes/map-to-iterable/map-to-iterable.pipe';
import { environment } from 'src/environments/environment';

import { DnbhubBottomSheetTextDetailsComponent } from './components/bottom-sheet-text-details/bottom-sheet-text-details.component';
import { DnbhubBrandDialogComponent } from './components/brand-dialog/brand-dialog.component';
import { DnbhubPlaylistsComponent } from './components/playlists/playlists.component';
import { DnbhubProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { DnbhubToolbarComponent } from './components/toolbar/toolbar.component';
import { DnbhubUserMeComponent } from './components/user-me/user-me.component';
import { DnbhubUserPlaylistsComponent } from './components/user-playlists/user-playlists.component';
import { DnbhubAboutStoreModule } from './state/about/about.module';
import { DnbhubAdminStoreModule } from './state/admin/admin.module';
import { DnbhubBlogStoreModule } from './state/blog/blog.module';
import { DnbhubHttpProgressStoreModule } from './state/http-progress/http-progress.module';
import { DnbhubSoundcloudStoreModule } from './state/soundcloud/soundcloud.module';
import { DnbhubToasterStoreModule } from './state/toaster/toaster.module';
import { DnbhubUiStoreModule } from './state/ui/ui.module';
import { DnbhubUserStoreModule } from './state/user/user.module';
import { APP_ENV, getWindow, WINDOW } from './utils';
import { getDocument } from './utils/providers';

const ngxsLoggerPluginOptions: NgxsLoggerPluginOptions = {
  collapsed: true,
  disabled: environment.production,
};

/**
 * Main application module.
 */
@NgModule({
  declarations: [
    DnbhubRootComponent,
    DnbhubNavbarComponent,
    DnbhubToolbarComponent,
    DnbhubIndexComponent,
    DnbhubPlaylistsComponent,
    DnbhubBlogComponent,
    DnbhubAboutComponent,
    DnbhubUserComponent,
    DnbhubUserMeComponent,
    DnbhubUserPlaylistsComponent,
    DnbhubAdminComponent,
    DnbhubSoundcloudPlayerComponent,
    DnbhubContactDialogComponent,
    DnbhubBrandDialogComponent,
    DnbhubLoginDialogComponent,
    DnbhubMapToIterablePipe,
    DnbhubBottomSheetTextDetailsComponent,
    DnbhubProgressBarComponent,
  ],
  entryComponents: [
    DnbhubContactDialogComponent,
    DnbhubLoginDialogComponent,
    DnbhubBottomSheetTextDetailsComponent,
    DnbhubProgressBarComponent,
    DnbhubBrandDialogComponent,
  ],
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
    NgxsLoggerPluginModule.forRoot(ngxsLoggerPluginOptions),
    DnbhubUiStoreModule,
    DnbhubHttpProgressStoreModule.forRoot(),
    DnbhubSoundcloudStoreModule,
    DnbhubBlogStoreModule,
    DnbhubAboutStoreModule,
    DnbhubAdminStoreModule,
    DnbhubUserStoreModule,
    DnbhubToasterStoreModule,
    DnbhubRoutingModule,
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: WINDOW, useFactory: getWindow },
    { provide: DOCUMENT, useFactory: getDocument },
    { provide: APP_ENV, useFactory: () => new DnbhubEnvironmentConfig() },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [DnbhubRootComponent],
})
export class DnbhubModule {
  constructor(
    private readonly matIconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer,
  ) {
    this.addIconsToRegistry();
  }

  /**
   * Adds icons to material icons registry.
   * TODO: move this to aseparate service.
   */
  private addIconsToRegistry(): void {
    this.matIconRegistry.addSvgIcon(
      'angular-logo',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/svg/Angular_logo.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'mailchimp-logo',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/svg/MailChimp_logo.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'soundcloud-logo',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/svg/SoundCloud_logo.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'twitter-logo',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/svg/TwitterBird_logo.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'dnbhub-logo-nobg-greyscale',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/svg/DH_logo-no_bg_greyscale.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'dnbhub-logo-roundbg',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/svg/DH_logo-round_bg.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'dnbhub-logo-roundbg-greyscale',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '/assets/svg/DH_logo-round_bg_greyscale.svg',
      ),
    );
  }
}
