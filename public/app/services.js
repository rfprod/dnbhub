/* Services */

var dnbhubServices = angular.module('dnbhubServices', ['ngResource']);

dnbhubServices.factory('regXpatternsService', [ function() {
	'use strict';
	/*
	*	regular expression patterns shared service
	*/
	return {
		email: /\w{2}@\w{2,}(\.)?\w{2,}/,
		soundcloudPlaylistLink: /https:\/\/soundcloud\.com\/\w+\/sets\/\w+/,
		text: /\w{3,}/
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
	'use strict';
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
	'use strict';
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
	'use strict';
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
	'use strict';
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
	'use strict';
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

dnbhubServices.service('firebaseService', [function() {
	'use strict';
	/* global firebase */
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
	this.get = function(collection) {
		if (collection && (collection === 'about' || collection === 'freedownloads' || collection === 'blog')) {
			return this.db.ref('/' + collection).once('value');
		} else {
			throw new TypeError('firebaseService, get(collection): missing collection identifier, which can have values: about, freedownloads, blog');
		}
	};
}]);
