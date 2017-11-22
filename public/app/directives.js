/* Directives */

var dnbhubDirectives = angular.module('dnbhubDirectives', []);

dnbhubDirectives.directive('setElementDimensionsOnload', ['$window',
	function($window){
		'use strict';
		return {
			restrict: 'A',
			link: (scope, element) => {
				element.on('load', () => {
					const iFrameHeight = $window.innerHeight - 75;
					const iFrameWidth = 400;
					element.css('width', iFrameWidth + 'px');
					element.css('height', iFrameHeight + 'px');
					console.log('element', element);
					const spotlight = angular.element(element.offsetParent());
					const spotlightWidth = spotlight[0].clientWidth;
					const elementMargin = ((spotlightWidth - iFrameWidth) / 2) - 15;
					console.log('resize params', spotlight, spotlightWidth, elementMargin);
					element.css({marginLeft: elementMargin + 'px', marginRight: elementMargin + 'px'});
				});
			}
		};
	}
]);

dnbhubDirectives.directive('customSoundcloudPlayer', [
	function() {
		'use strict';
		return {
			restrict: 'A',
			replace: true,
			templateUrl: 'app/views/custom-soundcloud-player.html',
			link: (scope, element) => {
				scope.selectedTrack;
				scope.selectTrack = (index) => {
					scope.selectedTrack = index;
				};
				scope.$watch(() => { return element[0].childNodes.length; }, (newVal, oldVal) => {
					if (!newVal && !oldVal) {
						console.log('soundcloud player DOM initial change:', newVal, '|', oldVal);
					} else if (newVal !== oldVal) {
						console.log('soundcloud player DOM changed:', newVal, '|', oldVal);
					}
				});
				scope.$watchCollection('tracks', (newVal) => {
					console.log('sc player, tracks changed', newVal);
				});
			}
		};
	}
]);
