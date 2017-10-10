'use strict';
/* Services */

var dnbhubServices = angular.module('dnbhubServices', ['ngResource']);

dnbhubServices.factory('regXpatternsService', [ function() {
	/*
	*	regular expression patterns shared service
	*/
	return {
		email: /\w{2}@\w{2,}(\.)?\w{2,}/,
		soundcloudPlaylistLink: /https:\/\/soundcloud\.com\/\w+\/sets\/\w+/,
		text: /\w{3,}/,
		password: /\w{8,}/
	};
}]);

/*
*	dynamically set backend base url to be able to deploy on any domain
*/
function setBaseUrl(absUrl) {
	//console.log('absUrl:', absUrl);
	//console.log(' >> set base URL. match', absUrl.match(new RegExp('http(s)?:\/\/[^/]+'), 'ig'));
	return absUrl.match(new RegExp('http(s)?://[^/]+'))[0];
}

dnbhubServices.factory('freedownloadsService', ['$resource', '$location', function($resource, $location) {
	var baseUrl = setBaseUrl($location.$$absUrl);
	console.log('abs base url:', baseUrl);
	return $resource(baseUrl + '/data/freedownloads-data.json', {}, {
		query: {method: 'GET', params: {}, isArray: true,
			interceptor: {
				response: function(response){
					response.resource.$httpHeaders = response.headers;
					return response.resource;
				}
			}
		}
	});
}]);

dnbhubServices.factory('blogPostsService', ['$resource', '$location', function($resource, $location) {
	var baseUrl = setBaseUrl($location.$$absUrl);
	console.log('abs base url:', baseUrl);
	return $resource(baseUrl + '/data/blog-posts.json', {}, {
		query: {method: 'GET', params: {}, isArray: true,
			interceptor: {
				response: function(response){
					response.resource.$httpHeaders = response.headers;
					return response.resource;
				}
			}
		}
	});
}]);

dnbhubServices.factory('dnbhubDetailsService', ['$resource', '$location', function($resource, $location) {
	var baseUrl = setBaseUrl($location.$$absUrl);
	console.log('abs base url:', baseUrl);
	return $resource(baseUrl + '/data/dnbhub-details.json', {}, {
		query: {method: 'GET', params: {}, isArray: false,
			interceptor: {
				response: function(response) {
					response.resource.$httpHeaders = response.headers;
					return response.resource;
				}
			}
		}
	});
}]);

dnbhubServices.factory('submitFormService', ['$resource', '$location', function($resource, $location) {
	var baseUrl = setBaseUrl($location.$$absUrl);
	console.log('abs base url:', baseUrl);
	return $resource(baseUrl + '/php/contact.php', {}, {
		query: {method: 'POST', params: {}, headers: {'Content-type': 'application/x-www-form-urlencoded'}, isArray: false,
			interceptor: {
				response: function(response) {
					response.resource.$httpHeaders = response.headers;
					return response.resource;
				}
			}
		}
	});
}]);

dnbhubServices.factory('addBlogPostService', ['$resource', '$location', function($resource, $location) {
	var baseUrl = setBaseUrl($location.$$absUrl);
	console.log('abs base url:', baseUrl);
	return $resource(baseUrl + '/php/add-blog-post.php', {}, {
		query: {method: 'POST', params: {}, headers: {'Content-type': 'application/x-www-form-urlencoded'}, isArray: false,
			interceptor: {
				response: function(response) {
					response.resource.$httpHeaders = response.headers;
					return response.resource;
				}
			}
		}
	});
}]);

dnbhubServices.service('firebaseService', ['$q', '$route', '$window', function($q, $route, $window) {
	var service = {
		/* global firebase */
		initFirebase: function() {
			var config = {
				apiKey: 'firebase_api_key',
				authDomain: 'firebase_auth_domain',
				databaseURL: 'firebase_database_url',
				projectId: 'firebase_project_id',
				storageBucket: 'firebase_storage_bucket',
				messagingSenderId: 'firebase_messaging_sender_id'
			};
			firebase.initializeApp(config);
			service.db = firebase.database();
			service.auth = firebase.auth;
			firebase.auth().onAuthStateChanged(function(user) {
				if (user) {
					console.log('user signed in', user);
					service.isSignedIn = true;
					if (!user.emailVerified) {
						user.sendEmailVerification()
							.then(function() {
								console.log('email verification sent');
								service.signout()
									.then(function() {
										console.log('signout success');
										$window.alert('Check your email for the latest verification link from Dnbhub firebaseapp mailer. You should verify your email first.');
										$route.reload();
									})
									.catch(function(error) {
										console.log('signout error', error);
										$window.alert('Error: try again later.');
										$route.reload();
									});
							});
					}
				} else {
					console.log('user signed out');
					service.isSignedIn = false;
				}
			});
		},

		db: undefined,
		auth: undefined,
		isSignedIn: false,

		getDB: function(collection) {
			if (collection && (collection === 'about' || collection === 'freedownloads' || collection === 'blog')) {
				return service.db.ref('/' + collection).once('value');
			} else {
				throw new TypeError('firebaseService, get(collection): missing collection identifier, which can have values: about, freedownloads, blog');
			}
		},

		authenticate: function(mode, payload) {
			var def = $q.defer();
			if (mode !== 'email' && mode !== 'twitter') {
				def.reject(new TypeError('mode must be: \'email\' or \'twitter\''));
			}
			if (typeof payload !== 'object') {
				def.reject(new TypeError('payload must be an object'));
			}

			console.log('mode:', mode);
			console.log('payload:', payload);

			if (mode === 'email' && payload.hasOwnProperty('email') && payload.hasOwnProperty('password')) {
				service.auth().signInWithEmailAndPassword(payload.email, payload.password)
					.then(function(success) {
						// console.log('auth success', success);
						def.resolve(success);
					})
					.catch(function(error) {
						// console.log('auth error', error);
						def.reject(error);
					});
			} else {
				def.reject(new ReferenceError('payload must have attributes: email, password'));
			}

			if (mode === 'twitter') {
				/*
				*	TODO
				*	https://firebase.google.com/docs/auth/web/twitter-login?authuser=0
				*/
			}
			return def.promise;
		},

		signout: function() {
			if (service.isSignedIn) {
				return service.auth().signOut();
			}
		},

		create: function(mode, payload) {
			var def = $q.defer();
			if (mode !== 'email') {
				def.reject(new TypeError('mode must be: \'email\''));
			}
			if (mode === 'email' && payload.hasOwnProperty('email') && payload.hasOwnProperty('password')) {
				service.auth().createUserWithEmailAndPassword(payload.email, payload.password)
					.then(function(success) {
						// console.log('auth success', success);
						def.resolve(success);
					})
					.catch(function(error) {
						// console.log('auth error', error);
						def.reject(error);
					});
			} else {
				def.reject(new ReferenceError('payload must have attributes: email, password'));
			}
			return def.promise;
		}
	};

	return service;

}]);
