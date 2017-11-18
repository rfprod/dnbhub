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
	const baseUrl = setBaseUrl($location.$$absUrl);
	// console.log('abs base url:', baseUrl);
	return $resource(baseUrl + '/data/freedownloads-data.json', {}, {
		query: {method: 'GET', params: {}, isArray: true,
			interceptor: {
				response: (response) => {
					response.resource.$httpHeaders = response.headers;
					return response.resource;
				}
			}
		}
	});
}]);

dnbhubServices.factory('blogPostsService', ['$resource', '$location', function($resource, $location) {
	const baseUrl = setBaseUrl($location.$$absUrl);
	// console.log('abs base url:', baseUrl);
	return $resource(baseUrl + '/data/blog-posts.json', {}, {
		query: {method: 'GET', params: {}, isArray: true,
			interceptor: {
				response: (response) => {
					response.resource.$httpHeaders = response.headers;
					return response.resource;
				}
			}
		}
	});
}]);

dnbhubServices.factory('dnbhubDetailsService', ['$resource', '$location', function($resource, $location) {
	const baseUrl = setBaseUrl($location.$$absUrl);
	// console.log('abs base url:', baseUrl);
	return $resource(baseUrl + '/data/dnbhub-details.json', {}, {
		query: {method: 'GET', params: {}, isArray: false,
			interceptor: {
				response: (response) => {
					response.resource.$httpHeaders = response.headers;
					return response.resource;
				}
			}
		}
	});
}]);

dnbhubServices.factory('submitFormService', ['$resource', '$location', function($resource, $location) {
	const baseUrl = setBaseUrl($location.$$absUrl);
	// console.log('abs base url:', baseUrl);
	return $resource(baseUrl + '/php/contact.php', {}, {
		query: {method: 'POST', params: {}, headers: {'Content-type': 'application/x-www-form-urlencoded'}, isArray: false,
			interceptor: {
				response: (response) => {
					response.resource.$httpHeaders = response.headers;
					return response.resource;
				}
			}
		}
	});
}]);

dnbhubServices.factory('addBlogPostService', ['$resource', '$location', function($resource, $location) {
	const baseUrl = setBaseUrl($location.$$absUrl);
	// console.log('abs base url:', baseUrl);
	return $resource(baseUrl + '/php/add-blog-post.php', {}, {
		query: {method: 'POST', params: {}, headers: {'Content-type': 'application/x-www-form-urlencoded'}, isArray: false,
			interceptor: {
				response: (response) => {
					response.resource.$httpHeaders = response.headers;
					return response.resource;
				}
			}
		}
	});
}]);

dnbhubServices.service('soundcloudService', [function() {
	const scid = 'soundcloud_client_id';
	const options = {
		client_id: scid,
		redirect_uri: 'http://dnbhub.com/callback.html'
	};
	const service = {
		/* global SC */
		init: () => {
			return SC.initialize(options);
		}
	};
	return service;
}]);


dnbhubServices.service('firebaseService', ['$rootScope', '$q', '$route', '$window', '$location', function($rootScope, $q, $route, $window, $location) {
	const service = {
		/* global firebase */
		initFirebase: () => {
			const config = {
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
			firebase.auth().onAuthStateChanged((user) => {
				if (user) {
					console.log('user signed in'/*, user*/);
					service.isSignedIn = true;
					if (!user.emailVerified) {
						user.sendEmailVerification()
							.then(() => {
								console.log('email verification sent');
								service.signout()
									.then(() => {
										console.log('signout success');
										$window.alert('Check your email for the latest verification link from Dnbhub firebaseapp mailer. You should verify your email first.');
										$route.reload();
									})
									.catch((error) => {
										console.log('signout error', error);
										$window.alert('Error: try again later.');
										$route.reload();
									});
							})
							.catch((error) => {
								console.log('send email verification error', error);
							});
					} else {
						service.user = user;
						$rootScope.$broadcast('hideAuthDialog');
						/*
						*	check if authed user has a database profile
						*	create if it's absent
						*/
						service.checkDBuserUID();
						if (user.email === 'connect@rfprod.tk') {
							$location.url('/admin');
						} else {
							$location.url('/user');
						}
					}
				} else {
					console.log('user signed out');
					service.isSignedIn = false;
				}
			});
		},

		db: undefined,
		auth: undefined,
		user: undefined,
		isSignedIn: false,

		getDB: (collection, refOnly) => {
			if (collection && (/(about|freedownloads|blog|users)/.test(collection))) {
				return (!refOnly) ? service.db.ref('/' + collection).once('value') : service.db.ref('/' + collection);
			} else {
				throw new TypeError('firebaseService, getDB(collection): missing collection identifier, which can have values: about, freedownloads, blog');
			}
		},

		authErrorCheck: () => {
			const typeError = new TypeError('firebaseService, user DB record action error: there seems to be no authenticated users');
			if (!service.user) {
				throw typeError;
			} else if (service.user && !service.user.uid) {
				throw typeError;
			}
		},

		checkDBuserUID: () => {
			const def = $q.defer();
			service.authErrorCheck();
			service.getDB('users/' + service.user.uid)
				.then((snapshot) => {
					console.log('checking user db profile');
					if (!snapshot.val()) {
						console.log('creating user db profile');
						service.db.ref('users/' + service.user.uid).set({
							created: new Date().getTime()
						}).then(() => {
							console.log('created user db profile');
							def.resolve({ exists: false, created: true });
						}).catch((error) => {
							console.log('error creating user db profile', error);
							def.reject({ exists: false, created: false });
						});
					} else {
						def.resolve({ exists: true, created: false });
					}
				})
				.catch((error) => {
					console.log('checkDBuserUID, user db profile check:', error);
					def.reject(error);
				});
			return def.promise;
		},

		setDBuserNewValues: (valuesObj) => {
			const def = $q.defer();
			service.authErrorCheck();
			service.checkDBuserUID()
				.then((data) => {
					console.log('checkDBuserUID', JSON.stringify(data));
					service.db.ref('users/' + service.user.uid).update(valuesObj)
						.then(() => {
							console.log('user db profile values set');
							def.resolve({ valuesSet: true });
						}).catch((error) => {
							console.log('error setting user db profile values', error);
							def.reject({ valuesSet: false });
						});
				}).catch((error) => {
					console.log('setDBuserValues, user db profile check error', error);
					def.reject(error);
				});
			return def.promise;
		},

		authenticate: (mode, payload) => {
			const def = $q.defer();
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
					.then((success) => {
						// console.log('auth success', success);
						def.resolve(success);
					})
					.catch((error) => {
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

		signout: () => {
			if (service.isSignedIn) {
				return service.auth().signOut();
			}
		},

		create: (mode, payload) => {
			const def = $q.defer();
			if (mode !== 'email') {
				def.reject(new TypeError('mode must be: \'email\''));
			}
			if (mode === 'email' && payload.hasOwnProperty('email') && payload.hasOwnProperty('password')) {
				service.auth().createUserWithEmailAndPassword(payload.email, payload.password)
					.then((success) => {
						// console.log('auth success', success);
						def.resolve(success);
					})
					.catch((error) => {
						// console.log('auth error', error);
						def.reject(error);
					});
			} else {
				def.reject(new ReferenceError('payload must have attributes: email, password'));
			}
			return def.promise;
		},

		delete: (email, password) => {
			const def = $q.defer();
			const credential = service.auth.EmailAuthProvider.credential(email, password);
			service.user.reauthenticateWithCredential(credential)
				.then(() => {
					// console.log('successfully reauthenticated');
					service.user.delete()
						.then(() => {
							// delete user db profile also
							service.getDB('users/' + service.user.uid, true).remove();
							def.resolve(true);
						})
						.catch((error) => {
							def.reject(error);
						});
				})
				.catch((error) => {
					def.reject(error);
				});
			return def.promise;
		}
	};

	return service;

}]);
