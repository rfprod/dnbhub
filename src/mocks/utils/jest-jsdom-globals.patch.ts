/* eslint-disable compat/compat */
import { setUpLocalStorageMock } from './local-storage.mock';

/**
 * Sets up Jest global mocks
 * which should be used in each app and lib in test-setup.ts files
 * because jest is using jsdom which is lacking some globals.
 */
// eslint-disable-next-line max-lines-per-function
export const setupJestJsdomGlobalMocks: () => void = () => {
  /**
   * Sets up local storage mock.
   */
  setUpLocalStorageMock();

  window.matchMedia = jest.fn().mockImplementation(query => {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  });

  window.resizeTo = jest.fn().mockImplementation((width: number, height: number) => {
    return { width, height };
  });

  Object.defineProperty(window, 'getComputedStyle', {
    value: () => {
      return {
        display: 'none',
        appearance: ['-webkit-appearance'],
        getPropertyValue: (): null => null,
      };
    },
  });

  Object.defineProperty(window.URL, 'createObjectURL', {
    value: jest.fn(),
    writable: false,
  });

  Object.defineProperty(global, 'fetch', {
    value: jest.fn(async () => {
      const promise: Promise<unknown> = new Promise((resolve: () => void) => {
        resolve();
      });
      return promise;
    }),
    writable: false,
  });

  Object.defineProperty(global, 'URL', {
    value: window.URL,
    writable: true,
  });

  function mutationObserver(...args: any[]) {
    return {
      observe: jest.fn(),
      takeRecords: jest.fn(),
      disconnect: jest.fn(),
    };
  }

  Object.defineProperty(global, 'MutationObserver', {
    value: mutationObserver,
    writable: false,
  });

  Object.defineProperty(global, 'SC', {
    value: {
      initialize: () => null,
    },
    writable: true,
  });

  /**
   * Override some console methods for testing environment.
   */
  window.console.log = (): null => null;
  window.console.group = (): null => null;
};
