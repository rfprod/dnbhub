import { ModuleWithProviders, NgModule } from '@angular/core';
import { TranslatePipe } from 'src/app/modules/translate/translate.pipe';
import { TranslateService } from 'src/app/modules/translate/translate.service';
import { TRANSLATION_PROVIDERS } from 'src/app/modules/translate/translations';

/**
 * Translate module.
 */
@NgModule({
  declarations: [TranslatePipe],
  exports: [TranslatePipe],
})
export class TranslateModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: TranslateModule,
      providers: [TRANSLATION_PROVIDERS, TranslateService],
    };
  }
}
