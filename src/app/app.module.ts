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
import { environment } from 'src/environments/environment';

import { DnbhubEnvironmentConfig, ENV } from './app.environment';
import { DnbhubRoutingModule } from './app-routing.module';
import { DnbhubAboutComponent } from './components/about/about.component';
import { DnbhubAdminComponent } from './components/admin/admin.component';
import { DnbhubAdminBrandsComponent } from './components/admin-brands/admin-brands.component';
import { DnbhubAdminEmailsComponent } from './components/admin-emails/admin-emails.component';
import { DnbhubAdminUsersComponent } from './components/admin-users/admin-users.component';
import { DnbhubBlogComponent } from './components/blog/blog.component';
import { DnbhubBottomSheetTextDetailsComponent } from './components/bottom-sheet-text-details/bottom-sheet-text-details.component';
import { DnbhubBrandDialogComponent } from './components/brand-dialog/brand-dialog.component';
import { DnbhubContactDialogComponent } from './components/contact-dialog/contact-dialog.component';
import { DnbhubIndexComponent } from './components/index/index.component';
import { DnbhubLoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { DnbhubNavbarComponent } from './components/navbar/navbar.component';
import { DnbhubPlaylistsComponent } from './components/playlists/playlists.component';
import { DnbhubProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { DnbhubRootComponent } from './components/root/root.component';
import { DnbhubSoundcloudPlayerComponent } from './components/soundcloud-player/soundcloud-player.component';
import { DnbhubToolbarComponent } from './components/toolbar/toolbar.component';
import { DnbhubTooltipComponent } from './components/tooltip/tooltip.component';
import { DnbhubTooltipDirective } from './components/tooltip/tooltip.directive';
import { DnbhubUserComponent } from './components/user/user.component';
import { DnbhubUserMeComponent } from './components/user-me/user-me.component';
import { DnbhubUserPlaylistActionsComponent } from './components/user-playlist-actions/user-playlist-actions.component';
import { DnbhubUserPlaylistsComponent } from './components/user-playlists/user-playlists.component';
import { DnbhubMaterialModule } from './modules/material/custom-material.module';
import { DnbhubTranslateModule } from './modules/translate/index';
import { DnbhubMapToIterablePipe } from './pipes/map-to-iterable/map-to-iterable.pipe';
import { DnbhubAboutStoreModule } from './state/about/about.module';
import { DnbhubAdminStoreModule } from './state/admin/admin.module';
import { DnbhubBlogStoreModule } from './state/blog/blog.module';
import { DnbhubFirebaseStoreModule } from './state/firebase/firebase.module';
import { DnbhubHttpProgressStoreModule } from './state/http-progress/http-progress.module';
import { DnbhubSoundcloudStoreModule } from './state/soundcloud/soundcloud.module';
import { DnbhubToasterStoreModule } from './state/toaster/toaster.module';
import { DnbhubUiStoreModule } from './state/ui/ui.module';
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
    DnbhubUserPlaylistActionsComponent,
    DnbhubTooltipComponent,
    DnbhubTooltipDirective,
    DnbhubAdminEmailsComponent,
    DnbhubAdminBrandsComponent,
    DnbhubAdminUsersComponent,
  ],
  entryComponents: [
    DnbhubContactDialogComponent,
    DnbhubLoginDialogComponent,
    DnbhubBottomSheetTextDetailsComponent,
    DnbhubProgressBarComponent,
    DnbhubBrandDialogComponent,
    DnbhubTooltipComponent,
    DnbhubAdminEmailsComponent,
    DnbhubAdminBrandsComponent,
    DnbhubAdminUsersComponent,
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
    DnbhubToasterStoreModule,
    DnbhubFirebaseStoreModule,
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
