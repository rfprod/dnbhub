exports.config = {

	onPrepare: function() {
		browser.angularAppRoot('html');
		browser.driver.get('http://localhost:3000/public/index.html');
	},

	specs: [
		'client/e2e/*.js'
	],

	capabilities: {
		browserName: 'chrome',
		chromeOptions: {
			args: [ '--headless', '--disable-gpu', '--window-size=1024x768' ]
		}
	},

	chromeOnly: true,

	directConnect: true,

	baseUrl: 'http://localhost:3000/',

	framework: 'jasmine',

	allScriptsTimeout: 30000,

	getPageTimeout: 30000,

	jasmineNodeOpts: {
		showColors: true,
		defaultTimeoutInterval: 30000
	}

};
