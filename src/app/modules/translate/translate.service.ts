import { Inject, Injectable } from '@angular/core';

import { TRANSLATIONS } from './translations';
import { IDictionaryObject, IUiDictionary } from './translations.interface';

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
  private language = 'en';

  /**
   * Current language getter.
   */
  public get currentLanguage(): string {
    return this.language;
  }

  /**
   * Current language setter.
   */
  public use(key: string): void {
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
    if (Boolean(this.translations[this.currentLanguage])) {
      let translation: string | IDictionaryObject | null = null;
      const keys = key.split('.');
      // eslint-disable-next-line no-labels
      searchString: for (const k of keys) {
        if (translation !== null) {
          const currentLanguageDictionary = this.translations[this.currentLanguage];
          if (Boolean(translation[k])) {
            translation = translation[k];
          } else if (Boolean(currentLanguageDictionary[k])) {
            translation = this.translations[this.currentLanguage][k];
          } else {
            // eslint-disable-next-line no-labels
            break searchString;
          }
        } else {
          translation = null;
          // eslint-disable-next-line no-labels
          break searchString;
        }
      }
      translation = !Boolean(translation) || typeof translation !== 'string' ? key : translation;
      return translation;
    }
    return key;
  }

  /**
   * Public method for translation resolution
   */
  public instant(key: string) {
    return this.translate(key);
  }
}
