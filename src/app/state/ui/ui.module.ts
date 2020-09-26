import { NgModule, Provider } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { DnbhubTranslateModule } from 'src/app/modules/translate/translate.module';

import { DnbhubUiService } from './ui.service';
import { DnbhubUiState } from './ui.store';

export const uiStoreModuleProviders: Provider[] = [DnbhubUiService];

@NgModule({
  imports: [DnbhubTranslateModule, NgxsModule.forFeature([DnbhubUiState])],
})
export class DnbhubUiStoreModule {}
