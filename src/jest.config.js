const jestPresetAngularSerializers = require('jest-preset-angular/build/serializers');

module.exports = {
  name: 'dnbhub',
  preset: '../jest.config.js',
  coverageDirectory: '../coverage/src',
  snapshotSerializers: jestPresetAngularSerializers,
};
