import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule, Provider } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgxsModule } from '@ngxs/store';

import { DnbhubAboutApiService } from './about-api.service';
import { DnbhubAboutService } from './about.service';
import { DnbhubAboutState } from './about.store';

export const blogStoreModuleProviders: Provider[] = [DnbhubAboutService, DnbhubAboutApiService];

@NgModule({
  imports: [MatSidenavModule, OverlayModule, NgxsModule.forFeature([DnbhubAboutState])],
})
export class DnbhubAboutStoreModule {}
