import { OverlayModule } from '@angular/cdk/overlay';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgxsModule } from '@ngxs/store';

import { UiService } from './ui.service';
import { UiState } from './ui.store';

export const uiStoreModuleProviders: Provider[] = [UiService];

@NgModule({
  imports: [MatSidenavModule, OverlayModule, NgxsModule.forFeature([UiState])],
  providers: [...uiStoreModuleProviders],
})
export class UiStoreModule {
  public static forRoot(): ModuleWithProviders<UiStoreModule> {
    return {
      ngModule: UiStoreModule,
      providers: [...uiStoreModuleProviders],
    };
  }
}
