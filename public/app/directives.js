/* Directives */

var dnbhubDirectives = angular.module('dnbhubDirectives', []);

dnbhubDirectives.directive('setElementDimensionsOnload', ['$window',
	function($window){
		'use strict';
		return {
			restrict: 'A',
			link: function(scope, element) {
				element.on('load', function(){
					var iFrameHeight = $window.innerHeight - 75;
					var iFrameWidth = 400;
					element.css('width', iFrameWidth + 'px');
					element.css('height', iFrameHeight + 'px');
					console.log('element', element);
					var spotlight = angular.element(element.offsetParent());
					var spotlightWidth = spotlight[0].clientWidth;
					var elementMargin = ((spotlightWidth - iFrameWidth) / 2) - 15;
					console.log('resize params', spotlight, spotlightWidth, elementMargin);
					element.css({marginLeft: elementMargin + 'px', marginRight: elementMargin + 'px'});
				});
			}
		};
	}
]);

dnbhubDirectives.directive('customSoundcloudPlayer', [
	function(){
		'use strict';
		return {
			restrict: 'A',
			link: function(scope, element) {
				scope.$watch(function() { return element[0].childNodes.length; }, function(newVal, oldVal) {
					if (!newVal && !oldVal) {
						console.log('soundcloud player DOM initial change:', newVal, '|', oldVal);
					} else if (newVal !== oldVal) {
						console.log('soundcloud player DOM changed:', newVal, '|', oldVal);
					}
				});
			}
		};
	}
]);
