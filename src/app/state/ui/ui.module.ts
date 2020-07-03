import { OverlayModule } from '@angular/cdk/overlay';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { DnbhubTranslateModule } from 'src/app/modules';

import { DnbhubUiService } from './ui.service';
import { DnbhubUiState } from './ui.store';

export const uiStoreModuleProviders: Provider[] = [DnbhubUiService];

@NgModule({
  imports: [OverlayModule, DnbhubTranslateModule, NgxsModule.forFeature([DnbhubUiState])],
})
export class DnbhubUiStoreModule {
  public static forRoot(): ModuleWithProviders<DnbhubUiStoreModule> {
    return {
      ngModule: DnbhubUiStoreModule,
    };
  }
}
