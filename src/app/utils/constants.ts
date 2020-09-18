export enum TIMEOUT {
  SHORTEST = 250,
  SHORTER = 500,
  SHORT = 1000,
  MEDUIM = 2500,
  LONG = 5000,
}

/**
 * Should be used to limit count of records when requesting it over API.
 */
export enum EPAGE_SIZE {
  SHORT = 10,
  DEFAULT = 25,
  MEDIUM = 50,
  LONG = 100,
}
