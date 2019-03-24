import { Injectable, Inject } from '@angular/core';
import { TRANSLATIONS } from './translations';

/**
 * Translate service for UI.
 */
@Injectable()
export class TranslateService {

  constructor(
    @Inject(TRANSLATIONS) private translations: any
  ) {}

  /**
   * Current language.
   */
  private CURRENT_LANGUAGE: string;

  /**
   * Current language getter.
   */
  public get currentLanguage(): string {
    /*
    *	public method for
    *	current language retrieval
    */
    return this.CURRENT_LANGUAGE;
  }

  /**
   * Current language setter.
   */
  public use(key: string): void {
    this.CURRENT_LANGUAGE = key;
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
    if (this.translations[this.currentLanguage]) {
      let translation = undefined as any;
      const keys = key.split('.') as string[];
      searchString:
      for (const k of keys) {
        if (!translation) {
          if (this.translations[this.currentLanguage][k]) {
            translation = this.translations[this.currentLanguage][k];
          } else {
            break searchString;
          }
        } else {
          if (translation[k]) {
            translation = translation[k];
          } else {
            translation = undefined;
            break searchString;
          }
        }
      }
      translation = (!translation || typeof translation !== 'string') ? key as string : translation;
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
