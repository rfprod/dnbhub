module.exports = function(config){
  config.set({
	  
	basePath : '../',
	
	files : [
		'public/bower_components/jquery/dist/jquery.min.js',
		'public/bower_components/angular/angular.js',
		'public/bower_components/angular-animate/angular-animate.js',
		'public/bower_components/angular-touch/angular-touch.js',
		'public/bower_components/angular-bootstrap/ui-bootstrap.js',
		'public/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
		'public/bower_components/angular-mocks/angular-mocks.js',
		'public/bower_components/angular-resource/angular-resource.js',
		'public/bower_components/angular-route/angular-route.js',
		'public/bower_components/angular-sanitize/angular-sanitize.js',
		'public/bower_components/angular-spinner/dist/angular-spinner.js',
		'public/bower_components/angular-websocket/dist/angular-websocket.js',
		//'public/js/vendor-pack.min.js',
		//'public/app/*.js',
		'public/js/packed-app.min.js',
		'test/client/unit/*.js',
	],

	autoWatch : true,

	frameworks: ['jasmine'],

	//browsers : ['Chrome', 'Firefox'],
	browsers: ['PhantomJS'],
	hostname: process.env.IP,
	port: process.env.PORT,
	runnerPort: 0,
	
	plugins : [
	//    'karma-chrome-launcher',
	//    'karma-firefox-launcher',
		'karma-phantomjs-launcher',
		'karma-jasmine'
	]

  });
};
