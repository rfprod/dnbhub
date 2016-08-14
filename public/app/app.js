'use strict';

/* App Module */
/* global angular */

var dnbhub = angular.module('dnbhub', [
  'ngRoute',
  'ngSanitize',
  'dnbhubControllers',
  'dnbhubDirectives',
  'dnbhubServices'
]);

dnbhub.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/index', {
        templateUrl: 'app/views/index.html',
        controller: 'indexCtrl'
      }).
      when('/blog', {
        templateUrl: 'app/views/blog.html',
        controller: 'blogCtrl',
        reloadOnSearch: false
      }).
      when('/singles', {
        templateUrl: 'app/views/singles.html',
        controller: 'singlesCtrl'
      }).
      when('/freedownloads', {
        templateUrl: 'app/views/freedownloads.html',
        controller: 'freeDownloadsCtrl'
      }).
      when('/reposts', {
        templateUrl: 'app/views/reposts.html',
        controller: 'repostsCtrl'
      }).
      when('/contact', {
        templateUrl: 'app/views/contact.html',
        controller: 'contactCtrl'
      }).
      when('/about', {
        templateUrl: 'app/views/about.html',
        controller: 'aboutCtrl'
      }).
      otherwise({
        redirectTo: '/index'
      });
}]);
