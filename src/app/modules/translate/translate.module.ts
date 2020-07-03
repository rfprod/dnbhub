import { ModuleWithProviders, NgModule } from '@angular/core';
import { DnbhubTranslatePipe } from 'src/app/modules/translate/translate.pipe';
import { TRANSLATION_PROVIDERS } from 'src/app/modules/translate/translations';

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
      providers: [TRANSLATION_PROVIDERS],
    };
  }
}
