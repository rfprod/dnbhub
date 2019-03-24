import { NgModule, ModuleWithProviders } from '@angular/core';

import { TRANSLATION_PROVIDERS } from 'src/app/modules/translate/translations';
import { TranslatePipe } from 'src/app/modules/translate/translate.pipe';
import { TranslateService } from 'src/app/modules/translate/translate.service';

/**
 * Translate module.
 */
@NgModule({
  declarations: [ TranslatePipe ],
  exports: [ TranslatePipe ]
})
export class TranslateModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: TranslateModule,
      providers: [ TRANSLATION_PROVIDERS, TranslateService ]
    };
  }
}
