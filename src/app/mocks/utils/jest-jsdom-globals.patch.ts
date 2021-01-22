import { setupLocalStorageMock } from './local-storage.mock';

/**
 * Sets up window match media mock.
 */
function setupWindowMatchMediaMock() {
  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));
}

/**
 * Sets up window resize to mock.
 */
function setupWindowResizeToMock() {
  window.resizeTo = jest
    .fn()
    .mockImplementation((width: number, height: number) => ({ width, height }));
}

/**
 * Sets up window get computed style mock.
 */
function setupWindowGetComputedStyleMock() {
  Object.defineProperty(window, 'getComputedStyle', {
    value: () => ({
      display: 'none',
      appearance: ['-webkit-appearance'],
      getPropertyValue: (): null => null,
    }),
  });
}

/**
 * Sets up window create object url mock.
 */
function setupWindowCreateObjectUrlMock() {
  Object.defineProperty(window.URL, 'createObjectURL', {
    value: jest.fn(),
    writable: false,
  });
}

/**
 * Sets up window CSS mock.
 */
function setupWindowCssMock() {
  Object.defineProperty(window, 'CSS', { value: null });
}

/**
 * Sets up global fetch mock.
 */
function setupGlobalFetchMock() {
  Object.defineProperty(global, 'fetch', {
    value: jest.fn(async () => {
      const promise: Promise<void> = new Promise((resolve: () => void) => {
        resolve();
      });
      return promise;
    }),
    writable: false,
  });
}

/**
 * Sets up global URL mock.
 */
function setupGlobalUrlMock() {
  Object.defineProperty(global, 'URL', {
    value: window.URL,
    writable: true,
  });
}

/**
 * Sets up global document doctype mock.
 */
function setupGlobalDocumentDoctypeMock() {
  Object.defineProperty(document, 'doctype', {
    value: '<!DOCTYPE html>',
  });
}

/**
 * Sets up global document.body.style transform mock.
 */
function setupGlobalDocumentBodyStyleTransformMock() {
  Object.defineProperty(document.body.style, 'transform', {
    value: () => ({
      enumerable: true,
      configurable: true,
    }),
  });
}

/**
 * Sets up global mutation observer mock.
 */
function setupGlobalMutationObserverMock() {
  /**
   * Mutation observer.
   */
  const mutationObserver = (...args: any[]) => ({
    observe: jest.fn(),
    takeRecords: jest.fn(),
    disconnect: jest.fn(),
  });

  Object.defineProperty(global, 'MutationObserver', {
    value: mutationObserver,
    writable: false,
  });
}

/**
 * Sets up global sourceloud mock.
 */
function setupSoundcloudGlobalMock() {
  Object.defineProperty(global, 'SC', {
    value: {
      initialize: () => null,
    },
    writable: true,
  });
}

/**
 * Sets up Jest global mocks
 * which should be used in each app and lib in test-setup.ts files
 * because jest is using jsdom which is lacking some globals.
 */
export const setupJestJsdomGlobalMocks: () => void = () => {
  setupLocalStorageMock();

  setupWindowMatchMediaMock();

  setupWindowResizeToMock();

  setupWindowGetComputedStyleMock();

  setupWindowCreateObjectUrlMock();

  setupWindowCssMock();

  setupGlobalFetchMock();

  setupGlobalUrlMock();

  setupGlobalDocumentDoctypeMock();

  setupGlobalDocumentBodyStyleTransformMock();

  setupGlobalMutationObserverMock();

  setupSoundcloudGlobalMock();

  /**
   * Override some console methods for testing environment.
   */
  window.console.log = (): null => null;
  window.console.group = (): null => null;
};
