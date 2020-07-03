import { OverlayContainer } from '@angular/cdk/overlay';
import { APP_BASE_HREF, DatePipe, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsModule } from '@ngxs/store';
import { DnbhubEnvironmentConfig } from 'src/app/app.environment';
import { DnbhubMaterialModule } from 'src/app/modules';
import { DnbhubTranslateModule } from 'src/app/modules/translate/translate.module';
import { DnbhubFirebaseService } from 'src/app/services/firebase/firebase.service';
import { DnbhubHttpHandlersService } from 'src/app/services/http-handlers/http-handlers.service';
import { DnbhubAboutStoreModule } from 'src/app/state/about/about.module';
import { DnbhubBlogStoreModule } from 'src/app/state/blog/blog.module';
import { DnbhubHttpProgressStoreModule } from 'src/app/state/http-progress/http-progress.module';
import { DnbhubHttpProgressService } from 'src/app/state/http-progress/http-progress.service';
import { DnbhubSoundcloudStoreModule } from 'src/app/state/soundcloud/soundcloud.module';
import { DnbhubUiStoreModule } from 'src/app/state/ui/ui.module';
import { APP_ENV, getWindow, WINDOW } from 'src/app/utils';

import { DummyComponent } from '../components/dummy.component.mock';

/**
 * Mocks core module providers.
 */
export const mocksCoreModuleProviders: Provider[] = [
  { provide: APP_BASE_HREF, useValue: '/' },
  { provide: LocationStrategy, useClass: PathLocationStrategy },
  { provide: WINDOW, useFactory: getWindow },
  { provide: APP_ENV, useFactory: () => new DnbhubEnvironmentConfig() },
  {
    provide: DnbhubHttpHandlersService,
    useFactory: (progress: DnbhubHttpProgressService, snackbar: MatSnackBar) =>
      new DnbhubHttpHandlersService(progress, snackbar),
    deps: [DnbhubHttpProgressService, MatSnackBar],
  },
  {
    provide: DnbhubFirebaseService,
    useValue: {},
  },
  {
    provide: OverlayContainer,
    useValue: {
      getContainerElement: () => {
        return {
          classList: {
            add: (): void => null,
            remove: (): void => null,
          },
          appendChild: (): void => null,
        };
      },
    },
  },
  {
    provide: MatSnackBar,
    useValue: {
      open: (): void => null,
    },
  },

  DatePipe,
];

/**
 * Mocks Core module.
 */
@NgModule({
  imports: [
    BrowserDynamicTestingModule,
    NoopAnimationsModule,
    HttpClientTestingModule,
    RouterTestingModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    DnbhubMaterialModule.forRoot(),
    DnbhubTranslateModule.forRoot(),
    NgxsModule.forRoot(),
    NgxsFormPluginModule.forRoot(),
    NgxsRouterPluginModule.forRoot(),
    DnbhubUiStoreModule.forRoot(),
    DnbhubHttpProgressStoreModule.forRoot(),
    DnbhubSoundcloudStoreModule.forRoot(),
    DnbhubBlogStoreModule.forRoot(),
    DnbhubAboutStoreModule.forRoot(),
  ],
  declarations: [DummyComponent],
  exports: [
    BrowserDynamicTestingModule,
    NoopAnimationsModule,
    HttpClientTestingModule,
    RouterTestingModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    DnbhubMaterialModule,
    NgxsModule,
    NgxsFormPluginModule,
    DnbhubUiStoreModule,
    DnbhubHttpProgressStoreModule,
    DnbhubSoundcloudStoreModule,
    DnbhubBlogStoreModule,
    DnbhubAboutStoreModule,
    DummyComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DnbhubMocksCoreModule {
  public static forRoot(): ModuleWithProviders<DnbhubMocksCoreModule> {
    return {
      ngModule: DnbhubMocksCoreModule,
      providers: [...mocksCoreModuleProviders],
    };
  }
}
