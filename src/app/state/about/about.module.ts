import { OverlayModule } from '@angular/cdk/overlay';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgxsModule } from '@ngxs/store';

import { AboutApiService } from './about-api.service';
import { AboutService } from './about.service';
import { AboutState } from './about.store';

export const blogStoreModuleProviders: Provider[] = [AboutService, AboutApiService];

@NgModule({
  imports: [MatSidenavModule, OverlayModule, NgxsModule.forFeature([AboutState])],
  providers: [...blogStoreModuleProviders],
})
export class AboutStoreModule {
  public static forRoot(): ModuleWithProviders<AboutStoreModule> {
    return {
      ngModule: AboutStoreModule,
      providers: [...blogStoreModuleProviders],
    };
  }
}
