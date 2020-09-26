import { NgModule, Provider } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { DnbhubSoundcloudApiService } from './soundcloud-api.service';
import { DnbhubSoundcloudService } from './soundcloud.service';
import { DnbhubSoundcloudState } from './soundcloud.store';

export const soundcloudStoreModuleProviders: Provider[] = [
  DnbhubSoundcloudService,
  DnbhubSoundcloudApiService,
];

@NgModule({
  imports: [NgxsModule.forFeature([DnbhubSoundcloudState])],
})
export class DnbhubSoundcloudStoreModule {}
