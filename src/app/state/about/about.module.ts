import { OverlayModule } from '@angular/cdk/overlay';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgxsModule } from '@ngxs/store';

import { DnbhubAboutApiService } from './about-api.service';
import { DnbhubAboutService } from './about.service';
import { DnbhubAboutState } from './about.store';

export const blogStoreModuleProviders: Provider[] = [DnbhubAboutService, DnbhubAboutApiService];

@NgModule({
  imports: [MatSidenavModule, OverlayModule, NgxsModule.forFeature([DnbhubAboutState])],
  providers: [...blogStoreModuleProviders],
})
export class DnbhubAboutStoreModule {
  public static forRoot(): ModuleWithProviders<DnbhubAboutStoreModule> {
    return {
      ngModule: DnbhubAboutStoreModule,
      providers: [...blogStoreModuleProviders],
    };
  }
}
