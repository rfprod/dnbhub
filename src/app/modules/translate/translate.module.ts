import { ModuleWithProviders, NgModule } from '@angular/core';

import { DnbhubTranslatePipe } from '../../modules/translate/translate.pipe';
import { translationProviders } from '../../modules/translate/translations';

/**
 * Translate module.
 */
@NgModule({
  declarations: [DnbhubTranslatePipe],
  exports: [DnbhubTranslatePipe],
})
export class DnbhubTranslateModule {
  public static forRoot(): ModuleWithProviders<DnbhubTranslateModule> {
    return {
      ngModule: DnbhubTranslateModule,
      providers: [...translationProviders],
    };
  }
}
