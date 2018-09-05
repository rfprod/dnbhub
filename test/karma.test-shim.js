/*global jasmine, __karma__, window*/
Error.stackTraceLimit = 0; // "No stacktrace"" is usually best for app testing.

// Uncomment to get full stacktrace output. Sometimes helpful, usually not.
//Error.stackTraceLimit = Infinity; //

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

var builtPath = '/base';

__karma__.loaded = function () { console.log('Karma loaded'); };

function isJsFile(path) {
	return path.slice(-3) == '.js';
}

function isSpecFile(path) {
	return /\.spec\.(.*\.)?js$/.test(path);
}

function isBuiltFile(path) {
	return isJsFile(path) && (path.substr(0, builtPath.length) == builtPath);
}

var allSpecFiles = Object.keys(window.__karma__.files)
	.filter(isSpecFile)
	.filter(isBuiltFile);

System.config({
	// Extend usual application package list with test folder
	//packages: { 'testing': { main: 'index.js', defaultExtension: 'js' } },

	// Assume npm: is set in `paths` in systemjs.config
	// Map the angular testing umd bundles
	map: {
		'@angular/core/testing': '/base/node_modules/@angular/core/bundles/core-testing.umd.js',
		'@angular/common/testing': '/base/node_modules/@angular/common/bundles/common-testing.umd.js',
		'@angular/common/http/testing': '/base/node_modules/@angular/common/bundles/common-http-testing.umd.js',
		'@angular/compiler/testing': '/base/node_modules/@angular/compiler/bundles/compiler-testing.umd.js',
		'@angular/forms/testing': '/base/node_modules/@angular/forms/bundles/forms-testing.umd.js',
		'@angular/http/testing': '/base/node_modules/@angular/http/bundles/http-testing.umd.js',
		'@angular/animations/testing': '/base/node_modules/@angular/animations/bundles/animations-browser-testing.umd.js',
		'@angular/platform-browser/testing': '/base/node_modules/@angular/platform-browser/bundles/platform-browser-testing.umd.js',
		'@angular/platform-browser-dynamic/testing': '/base/node_modules/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic-testing.umd.js',
		'@angular/router/testing': '/base/node_modules/@angular/router/bundles/router-testing.umd.js',

		'systemConfig': '/base/systemjs.karma.config.js',
		'systemConfigExtras': '/base/systemjs.config.extras.js',
	},
});

System.import('systemConfig')
	.then(importSystemJsExtras)
	.then(initTestBed)
	.then(initTesting);

/** Optional SystemJS configuration extras. Keep going w/o it */
function importSystemJsExtras(){
	return System.import('systemConfigExtras')
		.catch(function(reason) {
			console.log(
				'Warning: System.import could not load the optional "systemjs.config.extras.js". Did you omit it by accident? Continuing without it.'
			);
			console.log(reason);
		});
}

function initTestBed(){
	return Promise.all([
		System.import('@angular/core/testing'),
		System.import('@angular/platform-browser-dynamic/testing')
	])
		.then(function (providers) {
			var coreTesting    = providers[0];
			var browserTesting = providers[1];

			coreTesting.TestBed.initTestEnvironment(
				browserTesting.BrowserDynamicTestingModule,
				browserTesting.platformBrowserDynamicTesting());
		});
}

// Import all spec files and start karma
function initTesting () {
	console.log('INIT TESTINTG');
	console.log('test cases count:',allSpecFiles.length);
	console.log(allSpecFiles);
	return Promise.all(
		allSpecFiles.map(function (moduleName) {
			return System.import(moduleName);
		})
	)
		.then(__karma__.start, __karma__.error);
}
