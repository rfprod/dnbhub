import { NgModule, Provider } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { DnbhubAboutService } from './about.service';
import { DnbhubAboutState } from './about.store';
import { DnbhubAboutApiService } from './about-api.service';

export const blogStoreModuleProviders: Provider[] = [DnbhubAboutService, DnbhubAboutApiService];

@NgModule({
  imports: [NgxsModule.forFeature([DnbhubAboutState])],
})
export class DnbhubAboutStoreModule {}
