import { InjectionToken } from '@angular/core';

import { LANG_EN_NAME, LANG_EN_TRANSLATIONS } from './lang-en';
import { LANG_RU_NAME, LANG_RU_TRANSLATIONS } from './lang-ru';
import {
  ESUPPORTED_LANGUAGE_KEY,
  ISupportedLanguage,
  IUiDictionary,
} from './translations.interface';

export const TRANSLATIONS = new InjectionToken('translations');

export const dictionary: IUiDictionary = {
  [LANG_EN_NAME]: LANG_EN_TRANSLATIONS,
  [LANG_RU_NAME]: LANG_RU_TRANSLATIONS,
};

/**
 * Translation dictionaries provider.
 */
export const TRANSLATION_PROVIDERS = [{ provide: TRANSLATIONS, useValue: dictionary }];

export const supportedLanguages: ISupportedLanguage[] = [
  { key: ESUPPORTED_LANGUAGE_KEY.ENGLISH, name: 'English' },
  { key: ESUPPORTED_LANGUAGE_KEY.RUSSIAN, name: 'Russian' },
];
