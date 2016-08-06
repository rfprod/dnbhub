'use strict';

/* Services */
/* global angular */

var dnbhubServices = angular.module('dnbhubServices', ['ngResource']);

/*
*	dynamically set backend base url to be able to deploy on any domain
*/
function setBaseUrl(host,absUrl){
	return absUrl.substring(0,absUrl.indexOf('#')-1);
}

dnbhubServices.factory('freedownloadsService', ['$resource', '$location', function($resource, $location){
	var baseUrl = setBaseUrl($location.$$host, $location.$$absUrl);
	console.log('abs base url '+baseUrl);
	return $resource(baseUrl+'/data/freedownloads-data.json', {}, {
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

dnbhubServices.factory('blogPostsService', ['$resource', '$location', function($resource, $location){
	var baseUrl = setBaseUrl($location.$$host, $location.$$absUrl);
	console.log('abs base url '+baseUrl);
	return $resource(baseUrl+'/data/blog-posts.json', {}, {
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

dnbhubServices.factory('dnbhubDetailsService', ['$resource', '$location', function($resource, $location){
	var baseUrl = setBaseUrl($location.$$host, $location.$$absUrl);
	console.log('abs base url '+baseUrl);
	return $resource(baseUrl+'/data/dnbhub-details.json', {}, {
		query: {method: 'GET', params: {}, isArray: false,
			interceptor: {
				response: function(response){
					response.resource.$httpHeaders = response.headers;
					return response.resource;
				}
			}
		}
	});
}]);

dnbhubServices.factory('submitFormService', ['$resource', '$location', function($resource, $location){
	var baseUrl = setBaseUrl($location.$$host, $location.$$absUrl);
	console.log('abs base url '+baseUrl);
	return $resource(baseUrl+'/php/contact.php', {}, {
		query: {method: 'POST', params: {}, headers: {'Content-type': 'application/x-www-form-urlencoded'}, isArray: false,
			interceptor: {
				response: function(response){
					response.resource.$httpHeaders = response.headers;
					return response.resource;
				}
			}
		}
	});
}]);
