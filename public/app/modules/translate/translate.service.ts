import { Injectable, Inject } from '@angular/core';
import { TRANSLATIONS } from './translations'; // injection token reference

@Injectable()
export class TranslateService {

	constructor(
		@Inject(TRANSLATIONS) private _translations: any
	) {}

	/**
	 * Current language.
	 */
	private _currentLanguage: string;

	/**
	 * Current language getter.
	 */
	public get currentLanguage(): string {
		/*
		*	public method for
		*	current language retrieval
		*/
		return this._currentLanguage;
	}

	/**
	 * Current language setter.
	 */
	public use(key: string): void {
		this._currentLanguage = key;
	}

	/**
	 * Primate method for translation resolution.
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
		if (this._translations[this.currentLanguage]) {
			let translation = undefined as any;
			const keys = key.split('.') as string[];
			searchString:
			for (const k of keys) {
				if (!translation) {
					if (this._translations[this.currentLanguage][k]) {
						translation = this._translations[this.currentLanguage][k];
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
