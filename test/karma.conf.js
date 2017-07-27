module.exports = function(config){
  config.set({
	  
	basePath : '../',
	
	files : [
		'node_modules/jquery/dist/jquery.js',
		'node_modules/bootstrap/dist/js/bootstrap.js',

		'node_modules/angular/angular.js',
		'node_modules/angular-sanitize/angular-sanitize.js',
		'node_modules/angular-aria/angular-aria.js',
		'node_modules/angular-messages/angular-messages.js',
		'node_modules/angular-touch/angular-touch.js',
		'node_modules/angular-animate/angular-animate.js',
		'node_modules/angular-material/angular-material.js',
		'node_modules/angular-resource/angular-resource.js',
		'node_modules/angular-route/angular-route.js',
		'node_modules/angular-spinner/dist/angular-spinner.js',
		'node_modules/angular-mocks/angular-mocks.js',
		'node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
		'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
		'node_modules/angular-websocket/dist/angular-websocket.js',
		//'public/js/vendor-pack.min.js',
		//'public/app/*.js',
		'public/js/packed-app.min.js',
		'test/client/unit/*.js',
	],

	autoWatch : true,

	frameworks: ['jasmine'],

	customLaunchers: {
		/*
		*	this custom launcher requires setting env var CHROME_BIN=chromium-browser
		*	possible options for env var value depending on what you have installed:
		*	chromium-browser, chromium, google-chrome
		*/
		ChromeHeadless: {
			base: 'Chrome',
			flags: [
				'--headless',
				'--disable-gpu',
				// Without a remote debugging port Chrome exits immediately
				'--remote-debugging-port=9222'
			]
		}
	},
	browsers: ['ChromeHeadless'],
	//browsers : ['Chrome', 'Firefox'],
	plugins : [
		'karma-chrome-launcher',
	//    'karma-firefox-launcher',
		'karma-jasmine'
	],
	hostname: process.env.IP,
	port: process.env.PORT,
	runnerPort: 0
  });
};
