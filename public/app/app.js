/* App Module */

var dnbhub = angular.module('dnbhub', [
	'angularSpinner',
	'ngAnimate',
	'ngResource',
	'ngSanitize',
	'ngRoute',
	'ngTouch',
	'ui.bootstrap',
	'dnbhubControllers',
	'dnbhubDirectives',
	'dnbhubServices'
]);

dnbhub.config(['$routeProvider', '$locationProvider', 'usSpinnerConfigProvider',
	function($routeProvider, $locationProvider, usSpinnerConfigProvider) {
		$routeProvider
			.when('/index', {
				templateUrl: 'app/views/index.html',
				controller: 'indexCtrl'
			})
			.when('/blog', {
				templateUrl: 'app/views/blog.html',
				controller: 'blogCtrl',
				reloadOnSearch: false
			})
			.when('/singles', {
				templateUrl: 'app/views/singles.html',
				controller: 'singlesCtrl'
			})
			.when('/freedownloads', {
				templateUrl: 'app/views/freedownloads.html',
				controller: 'freeDownloadsCtrl',
				reloadOnSearch: false
			})
			.when('/reposts', {
				templateUrl: 'app/views/reposts.html',
				controller: 'repostsCtrl'
			})
			.when('/contact', {
				templateUrl: 'app/views/contact.html',
				controller: 'contactCtrl'
			})
			.when('/about', {
				templateUrl: 'app/views/about.html',
				controller: 'aboutCtrl'
			})
			.otherwise({
				redirectTo: '/index'
			});

		$locationProvider.html5Mode({enabled: true, requireBase: false});

		usSpinnerConfigProvider.setDefaults({
			lines: 13, // The number of lines to draw
			length: 28, // The length of each line
			width: 14, // The line thickness
			radius: 42, // The radius of the inner circle
			scale: 1, // Scales overall size of the spinner
			corners: 1, // Corner roundness (0..1)
			color: '#fff', // #rgb or #rrggbb or array of colors
			opacity: 0.25, // Opacity of the lines
			rotate: 0, // The rotation offset
			direction: 1, // 1: clockwise, -1: counterclockwise
			speed: 1, // Rounds per second
			trail: 60, // Afterglow percentage
			fps: 20, // Frames per second when using setTimeout() as a fallback for CSS
			zIndex: 2e9, // The z-index (defaults to 2000000000)
			className: 'spinner', // The CSS class to assign to the spinner
			top: '50vh', // Top position relative to parent
			left: '50%', // Left position relative to parent
			shadow: true, // Whether to render a shadow
			hwaccel: false, // Whether to use hardware acceleration
			position: 'fixed' // Element positioning
		});

	}
])
.run(['$rootScope', '$route', '$window',
	function ($rootScope, $route, $window) {
		$window.addEventListener('resize', function() {
			var current = $route.current.$$route.originalPath;
			if (current === '/index' || current === '/blog' || current === '/about') {
				$rootScope.$apply(function() {
					$route.reload();
				});
			}
		}, true);
	}
]);
