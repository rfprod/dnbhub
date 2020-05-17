import { OverlayModule } from '@angular/cdk/overlay';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgxsModule } from '@ngxs/store';

import { AdminApiService } from './admin-api.service';
import { AdminService } from './admin.service';
import { AdminState } from './admin.store';

export const adminStoreModuleProviders: Provider[] = [AdminService, AdminApiService];

@NgModule({
  imports: [MatSidenavModule, OverlayModule, NgxsModule.forFeature([AdminState])],
  providers: [...adminStoreModuleProviders],
})
export class AdminStoreModule {
  public static forRoot(): ModuleWithProviders<AdminStoreModule> {
    return {
      ngModule: AdminStoreModule,
      providers: [...adminStoreModuleProviders],
    };
  }
}
