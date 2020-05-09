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
