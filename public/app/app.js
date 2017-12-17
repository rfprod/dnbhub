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
		($routeProvider, $locationProvider, $mdThemingProvider) => {
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
				.when('/about', {
					templateUrl: 'app/views/about.html',
					controller: 'aboutCtrl'
				})
				.when('/admin', {
					templateUrl: 'app/views/admin.html',
					controller: 'adminCtrl'
				})
				.when('/user', {
					templateUrl: 'app/views/user.html',
					controller: 'userCtrl'
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
	.run(['$rootScope', '$location', 'firebaseService', 'soundcloudService',
		($rootScope, $location, firebaseService, soundcloudService) => {
			/*
			*	initialize firebase
			*/
			firebaseService.initFirebase();

			/*
			*	initialize soundcloud
			*/
			soundcloudService.init();

			$rootScope.$on('$locationChangeSuccess', (event, next, current) => {
				console.log('event', event);
				console.log('current', current);
				console.log('next', next);
				if (/\/user.*$/.test(next)) {
					console.log('user controls loaded, isSignedIn', firebaseService.isSignedIn);
					/*
					*	controller calls auth dialog if not authenticated
					*/
				} else if (/\/admin.*$/.test(next)) {
					console.log('admin controls loaded, isSignedIn', firebaseService.isSignedIn);
					/*
					*	controller calls auth dialog if not authenticated
					*/
					if (firebaseService.isSignedIn && !firebaseService.privilegedAccess()) {
						/*
						*	redirect to user if authenticated but without privileged access rights
						*/
						$location.path('/user');
					}
				}
			});
		}
	]);
