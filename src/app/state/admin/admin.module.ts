import { OverlayModule } from '@angular/cdk/overlay';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgxsModule } from '@ngxs/store';

import { DnbhubAdminApiService } from './admin-api.service';
import { DnbhubAdminService } from './admin.service';
import { DnbhubAdminState } from './admin.store';

export const adminStoreModuleProviders: Provider[] = [DnbhubAdminService, DnbhubAdminApiService];

@NgModule({
  imports: [MatSidenavModule, OverlayModule, NgxsModule.forFeature([DnbhubAdminState])],
  providers: [...adminStoreModuleProviders],
})
export class DnbhubAdminStoreModule {
  public static forRoot(): ModuleWithProviders<DnbhubAdminStoreModule> {
    return {
      ngModule: DnbhubAdminStoreModule,
      providers: [...adminStoreModuleProviders],
    };
  }
}
