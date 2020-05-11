export interface IDictionaryObject {
  [key: string]: string | IDictionaryObject;
}

export interface IUiDictionary {
  [key: string]: IDictionaryObject;
}

export interface ISupportedLanguage {
  key: string;
  name: string;
}

export enum ESUPPORTED_LANGUAGE_KEY {
  RUSSIAN = 'ru',
  ENGLISH = 'en',
}
