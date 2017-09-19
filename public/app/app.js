/* App Module */

var dnbhub = angular.module('dnbhub', [
	'ngAnimate',
	'ngResource',
	'ngSanitize',
	'ngRoute',
	'ngAria',
	'ngMessages',
	'ngMaterial',
	'dnbhubControllers',
	'dnbhubDirectives',
	'dnbhubServices'
]);

dnbhub
	.config(['$routeProvider', '$locationProvider', '$mdThemingProvider',
		function($routeProvider, $locationProvider, $mdThemingProvider) {
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

			$mdThemingProvider.theme('default')
				.primaryPalette('blue-grey')
				.accentPalette('amber')
				.warnPalette('red')
				//.backgroundPalette('blue-grey')
				.dark();
		}
	])
	.run(['$rootScope', '$route', '$window',
		function ($rootScope, $route, $window) {
			$window.addEventListener('resize', function() {
				var current = $route.current.$$route.originalPath;
				if (current === '/index' || current === '/blog' || current === '/about') {
					/*
					$rootScope.$apply(function() {
						$route.reload();
					});
					*/
				}
			}, true);
		}
	]);
