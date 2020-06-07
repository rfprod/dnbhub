import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { DnbhubMaterialModule, DnbhubTranslateModule } from 'src/app/modules';

import { DnbhubUiService } from './ui.service';
import { DnbhubUiState } from './ui.store';

export const uiStoreModuleProviders: Provider[] = [DnbhubUiService];

@NgModule({
  imports: [DnbhubMaterialModule, DnbhubTranslateModule, NgxsModule.forFeature([DnbhubUiState])],
  providers: [...uiStoreModuleProviders],
})
export class DnbhubUiStoreModule {
  public static forRoot(): ModuleWithProviders<DnbhubUiStoreModule> {
    return {
      ngModule: DnbhubUiStoreModule,
      providers: [...uiStoreModuleProviders],
    };
  }
}
