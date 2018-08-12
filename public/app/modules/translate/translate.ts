import { InjectionToken } from '@angular/core';

// translation desinitions
import { LANG_EN_NAME, LANG_EN_TRANSLATIONS } from './lang-en';
import { LANG_RU_NAME, LANG_RU_TRANSLATIONS } from './lang-ru';

// translation token
export const TRANSLATIONS = new InjectionToken('translations');

// translations dictionary
const dictionary = {
	[LANG_EN_NAME]: LANG_EN_TRANSLATIONS,
	[LANG_RU_NAME]: LANG_RU_TRANSLATIONS
};

// translation providers
export const TRANSLATION_PROVIDERS = [
	{ provide: TRANSLATIONS, useValue: dictionary }
];
