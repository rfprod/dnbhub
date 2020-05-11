import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { CustomMaterialModule, TranslateModule } from 'src/app/modules';

import { UiService } from './ui.service';
import { UiState } from './ui.store';

export const uiStoreModuleProviders: Provider[] = [UiService];

@NgModule({
  imports: [CustomMaterialModule, TranslateModule, NgxsModule.forFeature([UiState])],
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
