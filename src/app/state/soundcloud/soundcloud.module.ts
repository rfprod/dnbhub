import { OverlayModule } from '@angular/cdk/overlay';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgxsModule } from '@ngxs/store';

import { SoundcloudService } from './soundcloud.service';
import { SoundcloudState } from './soundcloud.store';

export const soundcloudStoreModuleProviders: Provider[] = [SoundcloudService];

@NgModule({
  imports: [MatSidenavModule, OverlayModule, NgxsModule.forFeature([SoundcloudState])],
  providers: [...soundcloudStoreModuleProviders],
})
export class SoundcloudStoreModule {
  public static forRoot(): ModuleWithProviders<SoundcloudStoreModule> {
    return {
      ngModule: SoundcloudStoreModule,
      providers: [...soundcloudStoreModuleProviders],
    };
  }
}
