import { NgModule, ModuleWithProviders } from '@angular/core';

import { TRANSLATION_PROVIDERS, TranslatePipe, TranslateService } from './index';

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
