// Karma configuration file, see link for more information https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({

    basePath: '',

    frameworks: ['jasmine', '@angular-devkit/build-angular'],

    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],

    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },

    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../coverage/dnbhub-cli'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },

    reporters: ['progress', 'kjhtml'],

    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--headless',
          '--no-sandbox',
          '--disable-gpu',
          '--enable-logging',
          '--no-default-browser-check',
          '--no-first-run',
          '--disable-default-apps',
          '--disable-popup-blocking',
          '--disable-translate',
          '--disable-background-timer-throttling',
          '--disable-renderer-backgrounding',
          '--disable-device-discovery-notifications',
          '--remote-debugging-port=9222',
          '--disable-web-security'
        ]
      }
    },

    browsers: ['ChromeHeadless'],

    captureTimeout: 210000,
    browserDisconnectTolerance: 4,
    browserDisconnectTimeout : 210000,
    browserNoActivityTimeout : 210000,

    browserConsoleLogOptions: {
      level: 'error',
      format: '%b %T %m',
      path: './coverage/browser-console.log',
      terminal: false
    },

    singleRun: false,

    autoWatch: true,

    port: 9876,

    colors: true,

    logLevel: config.LOG_ERROR

  });
};
