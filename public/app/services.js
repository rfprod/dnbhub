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

dnbhubServices.service('firebaseService', ['$q', function($q) {
	/* global firebase */
	this.initFirebase = function() {
		var config = {
			apiKey: 'firebase_api_key',
			authDomain: 'firebase_auth_domain',
			databaseURL: 'firebase_database_url',
			projectId: 'firebase_project_id',
			storageBucket: 'firebase_storage_bucket',
			messagingSenderId: 'firebase_messaging_sender_id'
		};
		firebase.initializeApp(config);
		this.db = firebase.database();
		this.auth = firebase.auth();
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				console.log('user signed in', user);
				this.isSignedIn = true;
			} else {
				console.log('user signed out');
				this.isSignedIn = false;
			}
		});
	};

	this.db = undefined;
	this.auth = undefined;
	this.isSignedIn = false;

	this.getDB = function(collection) {
		if (collection && (collection === 'about' || collection === 'freedownloads' || collection === 'blog')) {
			return this.db.ref('/' + collection).once('value');
		} else {
			throw new TypeError('firebaseService, get(collection): missing collection identifier, which can have values: about, freedownloads, blog');
		}
	};

	this.authenticate = function(mode, payload) {
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
			this.auth().signInWithEmailAndPassword(payload.email, payload.password)
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
	};

	this.signout = function() {
		if (this.auth) {
			return this.auth().signOut();
		}
	};

	this.create = function(mode, payload) {
		var def = $q.defer();
		if (mode !== 'email') {
			def.reject(new TypeError('mode must be: \'email\''));
		}
		if (mode === 'email' && payload.hasOwnProperty('email') && payload.hasOwnProperty('password')) {
			this.auth().createUserWithEmailAndPassword(payload.email, payload.password)
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
	};

}]);
