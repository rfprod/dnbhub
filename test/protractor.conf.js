exports.config = {

	directConnect: false,

	chromeOnly: false,

	allScriptsTimeout: 15000,

	specs: [
		'client/e2e/*.js'
	],

	capabilities: {
		//'browserName': 'chrome'
		'browserName': 'phantomjs',
		'phantomjs': {
			'binary': {
				'path': require('phantomjs-prebuilt').path
			},
			'ghostdriver': {
				'cli': {
					'args': ['--loglevel=DEBUG']
				}
			}
		}
	},

	baseUrl: 'http://localhost:3000/',

	framework: 'jasmine',

	jasmineNodeOpts: {
		defaultTimeoutInterval: 30000
	}

};
