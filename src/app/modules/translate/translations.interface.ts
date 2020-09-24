export interface IDictionaryObject {
  [key: string]: string | IDictionaryObject;
}

export interface IUiDictionary {
  [key: string]: IDictionaryObject;
}

export interface ISupportedLanguage {
  key: SUPPORTED_LANGUAGE_KEY;
  name: string;
}

export enum SUPPORTED_LANGUAGE_KEY {
  RUSSIAN = 'ru',
  ENGLISH = 'en',
}
