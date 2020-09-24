import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule, Provider } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgxsModule } from '@ngxs/store';

import { DnbhubSoundcloudApiService } from './soundcloud-api.service';
import { DnbhubSoundcloudService } from './soundcloud.service';
import { DnbhubSoundcloudState } from './soundcloud.store';

export const soundcloudStoreModuleProviders: Provider[] = [
  DnbhubSoundcloudService,
  DnbhubSoundcloudApiService,
];

@NgModule({
  imports: [MatSidenavModule, OverlayModule, NgxsModule.forFeature([DnbhubSoundcloudState])],
})
export class DnbhubSoundcloudStoreModule {}
