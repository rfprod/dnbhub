'use strict';

/* Directives */
/* global angular */

var dnbhubDirectives = angular.module('dnbhubDirectives', []);

dnbhubDirectives.directive('setElementDimensionsOnload', ['$window', function($window){
return {
    restrict: 'A',
    link: function(scope, element, attrs){
        element.on('load', function(){
            var iFrameHeight = $window.innerHeight - 75;
            var iFrameWidth = 350;
            element.css('width', iFrameWidth+'px');
            element.css('height', iFrameHeight+'px');
            console.log('element',element);
            var spotlight = angular.element(element.offsetParent());
            var spotlightWidth = spotlight[0].clientWidth;
            var elementMargin = (spotlightWidth - iFrameWidth)/2;
            console.log('resize params',spotlight,spotlightWidth,elementMargin);
            element.css({marginLeft: elementMargin+'px', marginRight: elementMargin+'px'});
        });
    }
}}])