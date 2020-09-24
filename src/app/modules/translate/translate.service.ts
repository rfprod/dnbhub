import { Inject, Injectable } from '@angular/core';

import { TRANSLATIONS } from './translations';
import { IDictionaryObject, IUiDictionary, SUPPORTED_LANGUAGE_KEY } from './translations.interface';

/**
 * Translate service for UI.
 */
@Injectable({
  providedIn: 'root',
})
export class DnbhubTranslateService {
  constructor(@Inject(TRANSLATIONS) private readonly translations: IUiDictionary) {}

  /**
   * Current language.
   */
  private language: SUPPORTED_LANGUAGE_KEY = SUPPORTED_LANGUAGE_KEY.ENGLISH;

  /**
   * Current language getter.
   */
  public get currentLanguage() {
    return this.language;
  }

  /**
   * Current language setter.
   */
  public use(key: SUPPORTED_LANGUAGE_KEY): void {
    this.language = key;
  }

  /**
   * Private method for translation resolution.
   *
   * If key contains dots '.', it will be parsed as a sequence of keys, e.g.:
   * translate('page.title') reads a translations dictionary like so { page: { title: 'page title value' } }.
   *
   * Other characters are not considered special, e.g.:
   * translate('page_title') reads a translations dictionary like so { page_title: 'page title value' }.
   *
   * @param key dictionary key
   */
  private translate(key: string): string {
    const dictionary = this.translations[this.language];

    const keys = key.split('.');

    let dictionaryTree = { ...dictionary };
    let translation: string | IDictionaryObject | undefined;

    for (const k of keys) {
      if (typeof dictionaryTree[k] === 'undefined') {
        translation = key;
      } else if (typeof dictionaryTree[k] === 'string') {
        translation = dictionaryTree[k];
      } else {
        dictionaryTree = dictionaryTree[k] as IDictionaryObject;
      }
    }

    translation = typeof translation !== 'string' ? key : translation;

    return translation;
  }

  /**
   * Public method for translation resolution
   */
  public instant(key: string) {
    return this.translate(key);
  }
}
