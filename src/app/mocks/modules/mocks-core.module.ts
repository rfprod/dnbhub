import { OverlayContainer } from '@angular/cdk/overlay';
import { APP_BASE_HREF, DatePipe, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsModule } from '@ngxs/store';
import { AppEnvironmentConfig } from 'src/app/app.environment';
import { CustomMaterialModule } from 'src/app/modules';
import { BlogStoreModule } from 'src/app/state/blog/blog.module';
import { HttpProgressStoreModule } from 'src/app/state/http-progress/http-progress.module';
import { SoundcloudStoreModule } from 'src/app/state/soundcloud/soundcloud.module';
import { UiStoreModule } from 'src/app/state/ui/ui.module';
import { APP_ENV, getWindow, WINDOW } from 'src/app/utils';

import { AboutStoreModule } from '../../state/about/about.module';
import { DummyComponent } from '../components/dummy.component';

/**
 * Mocks core module providers.
 */
export const mocksCoreModuleProviders: Provider[] = [
  { provide: APP_BASE_HREF, useValue: '/' },
  { provide: LocationStrategy, useClass: PathLocationStrategy },
  { provide: WINDOW, useFactory: getWindow },
  { provide: APP_ENV, useFactory: () => new AppEnvironmentConfig() },
  {
    provide: OverlayContainer,
    useValue: {
      getContainerElement: () => {
        return {
          classList: {
            add: (): void => null,
            remove: (): void => null,
          },
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
    CustomMaterialModule.forRoot(),
    NgxsModule.forRoot(),
    NgxsFormPluginModule.forRoot(),
    NgxsRouterPluginModule.forRoot(),
    UiStoreModule.forRoot(),
    HttpProgressStoreModule.forRoot(),
    SoundcloudStoreModule.forRoot(),
    BlogStoreModule.forRoot(),
    AboutStoreModule.forRoot(),
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
    CustomMaterialModule,
    NgxsModule,
    NgxsFormPluginModule,
    DummyComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MocksCoreModule {
  public static forRoot(): ModuleWithProviders<MocksCoreModule> {
    return {
      ngModule: MocksCoreModule,
      providers: [...mocksCoreModuleProviders],
    };
  }
}
