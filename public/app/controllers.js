/* Controllers */

var dnbhubControllers = angular.module('dnbhubControllers', ['angularSpinner']);

dnbhubControllers.controller('navCtrl', ['$scope', '$document', '$element', '$location', '$mdComponentRegistry', '$mdSidenav', 'usSpinnerService',
	function($scope, $document, $element, $location, $mdComponentRegistry, $mdSidenav, usSpinnerService) {
		'use strict';
		$scope.title = 'Drum and Bass Hub';
		$scope.buttonTitles = {
			index: 'Index - Drum and Bass Hub index',
			singles: 'Singles - Soundcloud powered production showcase; all downloadable sounds are free for personal use and/or promotional purposes only',
			freedownloads: 'Free Downloads - Hive and Soundcloud powered section featuring freely downloadable music, produced by Dnbhub in-house artists',
			reposts: 'Featured - Soundcloud powered RePosts playlists, featuring drum and bass producers, DJs, and MCs audio compositions',
			blog: 'Blog - Drum and Bass related press releases',
			contact: 'Contact form - use it for any enquires correlating with Drum and Bass Hub activities',
			about: 'All trademarks and copyrights are property of their respective owners'
		};
		$scope.buttonIcons = {
			index: 'fa fa-fire',
			singles: 'fa fa-music',
			freedownloads: 'fa fa-cloud-download',
			reposts: 'fa fa-retweet',
			blog: 'fa fa-th-large',
			contact: 'fa fa-envelope',
			about: 'fa fa-copyright'
		};
		$scope.currentYear = new Date().getFullYear();
		$scope.buttonNames = {
			index: 'Index',
			singles: 'Singles',
			freedownloads: 'Free Downloads',
			reposts: 'Featured',
			blog: 'Blog',
			contact: 'Contact',
			about: 'VS 2011-'+$scope.currentYear
		};
		$scope.buttonHrefs = {
			index: 'index',
			singles: 'singles',
			freedownloads: 'freedownloads',
			reposts: 'reposts',
			blog: 'blog',
			contact: 'contact',
			about: 'about'
		};
		$scope.selectButton = function(href) {
			// console.log('selectButton, href:', href);
			if ($location.path().slice(1) === href) {
				// console.log('selectButton, path:', $location.path());
				return true;
			} else {
				return false;
			}
		};
		$scope.sounds = ['../sounds/blip.mp3'];
		$scope.speakerObj = null;
		$scope.playSound = function() {
			$scope.speakerObj.setAttribute('src', $scope.sounds[0]);
			$scope.speakerObj.setAttribute('autoplay', 'autoplay');
			$scope.speakerObj.addEventListener('load', function() {
				$scope.speakerObj.play();
			}, true);
		};
		$scope.disableToggler = function() {
			// console.log('$mdComponentRegistry.get(\'left\'):', $mdComponentRegistry.get('left'));
			return !$mdComponentRegistry.get('left');
		};
		$scope.toggleSidenav = function() {
			if ($mdComponentRegistry.get('left')) {
				$mdSidenav('left').toggle();
			}
		};
		$scope.isSidenavOpen = function() {
			/*
			*	actual function logic must be set after focument is ready
			*	or it will generate errors, because sidenav DOM object loads after the main navbar
			*/
			if ($mdComponentRegistry.get('left')) {
				// console.log('is sidenav open', $mdSidenav('left').isOpen());
				return $mdSidenav('left').isOpen();
			}
			return false;
		};
		$document.ready(function() {
			console.log('document ready');
			usSpinnerService.spin('root-spinner');
			// console.log($element);
			$scope.speakerObj = $element[0].querySelector('#speaker');
		});
	}
]);

dnbhubControllers.controller('indexCtrl', ['$scope', '$route', 'usSpinnerService',
	function($scope, $route, usSpinnerService) {
		'use strict';
		$scope.tracks = [];
		$scope.getTracks = function(callback) {
			SC.initialize({ client_id: 'dc01ec1b4ea7d41793e61bac1dae13c5' });
			SC.get('http://api.soundcloud.com/users/1275637/tracks.json?client_id=dc01ec1b4ea7d41793e61bac1dae13c5', function(tracks) {
				$scope.tracks = tracks;
				$scope.$digest();
				callback();
			});
		};
		$scope.$on('$viewContentLoaded', function() {
			console.log('index view controller loaded');
			$scope.getTracks(function() {
				usSpinnerService.stop('root-spinner');
			});
		});
		$scope.$on('$destroy', function() {
			console.log('index view controller destroyed');
			usSpinnerService.spin('root-spinner');
		});
	}
]);

dnbhubControllers.controller('singlesCtrl', ['$scope', 'usSpinnerService',
	function($scope, usSpinnerService) {
		'use strict';
		$scope.$on('$viewContentLoaded', function() {
			console.log('singles view controller loaded');
			usSpinnerService.stop('root-spinner');
		});
		$scope.$on('$destroy', function() {
			console.log('singles view controller destroyed');
			usSpinnerService.spin('root-spinner');
		});
	}
]);

dnbhubControllers.controller('freeDownloadsCtrl', ['$scope', '$sce', '$location', '$mdSidenav', 'usSpinnerService', 'freedownloadsService',
	function($scope, $sce, $location, $mdSidenav, usSpinnerService, freedownloadsService) {
		'use strict';
		$scope.freedownloadsData = [];
		$scope.selectedWidget = 1;
		$scope.scWidgetLink = {
			first: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/',
			last: '&amp;color=ff5500&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false'
		};
		$scope.widgetLink = function(soundcloudTrackID) {
			return $sce.trustAsResourceUrl($scope.scWidgetLink.first + soundcloudTrackID + $scope.scWidgetLink.last);
		};
		$scope.updateFreedownloadsData = function() {
			freedownloadsService.query({}).$promise.then(function(response){
				$scope.freedownloadsData = [];
				response.forEach(function(element) {
					$scope.freedownloadsData.push(element);
				});
				$scope.welectedWidget = 0;
				usSpinnerService.stop('root-spinner');
			});
		};
		$scope.scrollToTrack = function(widgetIndex) {
			$scope.selectedWidget = widgetIndex;
			$location.$$hash = widgetIndex;
			$mdSidenav('left').toggle();
		};
		$scope.$on('$viewContentLoaded', function() {
			console.log('free downloads view controller loaded');
			$scope.updateFreedownloadsData();
		});
		$scope.$on('$destroy', function() {
			console.log('free downloads view controller destroyed');
			usSpinnerService.spin('root-spinner');
		});
	}
]);

dnbhubControllers.controller('repostsCtrl', ['$scope', 'usSpinnerService',
	function($scope, usSpinnerService) {
		'use strict';
		$scope.$on('$viewContentLoaded', function() {
			console.log('reposts view controller loaded');
			usSpinnerService.stop('root-spinner');
		});
		$scope.$on('$destroy', function() {
			console.log('reposts view controller destroyed');
			usSpinnerService.spin('root-spinner');
		});
	}
]);

dnbhubControllers.controller('blogCtrl', ['$scope', '$sce', '$route', '$location', '$mdDialog', 'usSpinnerService', 'blogPostsService',
	function($scope, $sce, $route, $location, $mdDialog, usSpinnerService, blogPostsService) {
		'use strict';
		$scope.inputReleaseCode = undefined;
		$scope.blogPosts = [];
		$scope.selectedBlogPostId = 0;
		$scope.selectedBlogPost = {};
		$scope.disableBlogPostSelector = function(direction) {
			if (direction === 'previous') {
				return ($scope.selectedBlogPostId === $scope.blogPosts.length - 1) ? true : false;
			} else if (direction === 'next') {
				return ($scope.selectedBlogPostId === 0) ? true : false;
			}
		};
		$scope.returnWidgetLink = function() {
			return $sce.trustAsResourceUrl($scope.selectedBlogPost.widgetLink);
		};
		/*
		*	sidebar soundcloud player
		*/
		$scope.tracks = [];
		$scope.getTracks = function(soundcloudUserId,callback) {
			SC.initialize({ client_id: 'dc01ec1b4ea7d41793e61bac1dae13c5' });
			SC.get('http://api.soundcloud.com/users/'+soundcloudUserId+'/tracks.json?client_id=dc01ec1b4ea7d41793e61bac1dae13c5', function(tracks) {
				$scope.tracks = tracks;
				$scope.$digest();
				callback();
			});
		};
		/*
		*	blog posts navigation
		*/
		$scope.setProperSearchParam = function() {
			var search = $location.search();
			if ($scope.selectedBlogPost) {
				search.code = $scope.selectedBlogPost.code;
				console.log('location.search: ',search);
				$location.search(search);
			}
		};
		$scope.updateBlogPosts = function() {
			blogPostsService.query({}).$promise.then(function(response) {
				$scope.blogPosts = [];
				response.forEach(function(element) {
					$scope.blogPosts.push(element);
				});
				if ($scope.inputReleaseCode) {
					$scope.blogPosts.forEach(function(value, index) {
						if (value.code === $scope.inputReleaseCode) {
							$scope.selectedBlogPostId = index;
						}
					});
					$scope.inputReleaseCode = undefined;
					$scope.selectedBlogPost = $scope.blogPosts[$scope.selectedBlogPostId];
					if ($scope.selectedBlogPostId === 0) { $scope.setProperSearchParam(); }
				}else{
					$scope.selectedBlogPost = $scope.blogPosts[$scope.selectedBlogPostId];
					$scope.setProperSearchParam();
				}
				$scope.getTracks($scope.selectedBlogPost.soundcloudUserId,function() {
					usSpinnerService.stop('root-spinner');
				});
			});
		};
		$scope.selectBlogPost = function() {
			if ($scope.blogPosts.length > 0) {
				usSpinnerService.spin('root-spinner');
				$scope.selectedBlogPost = $scope.blogPosts[$scope.selectedBlogPostId];
				$scope.setProperSearchParam();
				$scope.getTracks($scope.selectedBlogPost.soundcloudUserId,function() {
					usSpinnerService.stop('root-spinner');
				});
			}
		};
		$scope.$watch('selectedBlogPostId', function(newVal) {
			console.log('selectedBlogPostId new val: ',newVal);
			if ($scope.selectedBlogPost && !$scope.inputReleaseCode) { $scope.selectBlogPost(); }
		});
		$scope.nextBlogPost = function() {
			if ($scope.selectedBlogPostId > 0) {
				$scope.selectedBlogPostId--;
			} else {
				console.log('this is a last blog post');
			}
		};
		$scope.previousBlogPost = function() {
			if ($scope.selectedBlogPostId < $scope.blogPosts.length-1) {
				$scope.selectedBlogPostId++;
			} else {
				console.log('this is a first blog post');
			}
		};
		/*
		*	actions
		*/
		$scope.actions = {
			open: false
		};
		$scope.showAddBlogPostDialog = function(event) {
			console.log('event', event);
			$mdDialog.show({
				controller: 'addBlogPostDialogCtrl',
				templateUrl: 'app/views/add-blog-post-dialog.html',
				parent: angular.element(document.body),
				targetEvent: event,
				clickOutsideToClose: true,
				fullscreen: false
			}).then(
				function(result) {
					console.log('result', result);
				},
				function() {
					console.log('dialog dismissed at', new Date().getTime());
				}
			);
		};
		/*
		*	lifecycle
		*/
		$scope.$on('$viewContentLoaded', function() {
			console.log('blog view controller loaded');
			var search = $location.search();
			if (search.code) {
				console.log('location.search: ',search);
				$scope.inputReleaseCode = search.code;
			}
			$scope.updateBlogPosts();
		});
		$scope.$on('$destroy', function() {
			console.log('blog view controller destroyed');
			usSpinnerService.spin('root-spinner');
		});
	}
]);

dnbhubControllers.controller('addBlogPostDialogCtrl', ['$scope', '$mdDialog', '$timeout', 'addBlogPostService',
	function($scope, $mdDialog, $timeout, addBlogPostService) {
		'use strict';
		$scope.form = {
			email: '',
			soundcloudPlaylistLink: ''
		};
		$scope.sendMailResponse = {error: '', success: ''};
		$scope.hide = function() {
			$mdDialog.hide();
		};
		$scope.cancel = function() {
			$mdDialog.cancel();
		};
		$scope.submit = function() {
			var params = 'email=' + $scope.form.email + '&link=' + $scope.form.soundcloudPlaylistLink;
			addBlogPostService.query(params).$promise.then(function(response) {
				console.log('addBlogPostService, response', response);
				if (response.error) $scope.sendMailResponse.error = response.error;
				if (response.success) {
					$scope.sendMailResponse.error = '';
					$scope.sendMailResponse.success = response.success;
				}
				$timeout(function() {
					if ($scope.sendMailResponse.success) {
						$mdDialog.hide($scope.form);
					}
				},5000);
			});
		};
		/*
		*	lifecycle
		*/
		$scope.$on('$viewContentLoaded', function() {
			console.log('add blog post dialog controller loaded');
		});
		$scope.$on('$destroy', function() {
			console.log('add blog post dialog controller destroyed');
		});
	}
]);

dnbhubControllers.controller('contactCtrl', ['$scope', '$timeout', 'usSpinnerService', 'submitFormService',
	function($scope, $timeout, usSpinnerService, submitFormService) {
		'use strict';
		$scope.email = '';
		$scope.name = '';
		$scope.header = '';
		$scope.message = '';
		$scope.buttonText = {reset: 'Reset all fields', submit: 'Send message'};
		$scope.params = '';
		$scope.sendMailResponse = {error: '', success: ''};
		$scope.hideInstructions = false;
		$scope.switchInstructionsVisibility = function() {
			$scope.hideInstructions = true;
		};
		$scope.instructions = {
			intro: 'Use this contact form for any enquiries correlating with Drum\'n\'Bass Hub activities, for example:',
			list: [
				'make an info support request - have a blog post for your upcoming release;',
				'make a collaboration or hire request - work with us in the context of audio production from scratch or remixing;',
				'make a licencing request - use music, published by Dnbhub, for your needs;',
				'make any other request - did we miss something?'
			]
		};
		$scope.resetForm = function() {
			$scope.email = '';
			$scope.name = '';
			$scope.header = '';
			$scope.message = '';
		};
		$scope.submitForm = function() {
			//$scope.params = { name: $scope.name, email: $scope.email, header: $scope.header, message: $scope.message };
			$scope.params = 'name=' + $scope.name + '&email=' + $scope.email + '&header=' + $scope.header + '&message=' + $scope.message;
			submitFormService.query($scope.params).$promise.then(function(response) {
				console.log(response);
				if (response.error) $scope.sendMailResponse.error = response.error;
				if (response.success) {
					$scope.sendMailResponse.success = response.success;
					$scope.resetForm();
				}
				$timeout(function() {
					$scope.sendMailResponse.error = '';
					$scope.sendMailResponse.success = '';
				},5000);
			});
		};
		$scope.$on('$viewContentLoaded', function() {
			console.log('contact view controller loaded');
			usSpinnerService.stop('root-spinner');
		});
		$scope.$on('$destroy', function() {
			console.log('contact view controller destroyed');
			usSpinnerService.spin('root-spinner');
		});
	}
]);

dnbhubControllers.controller('aboutCtrl', ['$scope', '$route', 'usSpinnerService', 'dnbhubDetailsService',
	function($scope, $route, usSpinnerService, dnbhubDetailsService) {
		'use strict';
		$scope.dnbhubDetails = {};
		$scope.updateDnbhubDetails = function() {
			dnbhubDetailsService.query({}).$promise.then(function(response) {
				$scope.dnbhubDetails = {};
				var keys = Object.keys(response);
				// console.log('keys, response:', keys, ',', response);
				keys.forEach(function(key) {
					$scope.dnbhubDetails[key] = response[key];
				});
				// console.log('$scope.dnbhubDetails:', $scope.dnbhubDetails);
				usSpinnerService.stop('root-spinner');
			});
		};
		$scope.$on('$viewContentLoaded', function() {
			console.log('about view controller loaded');
			$scope.updateDnbhubDetails();
		});
		$scope.$on('$destroy', function() {
			console.log('about view controller destroyed');
			usSpinnerService.spin('root-spinner');
		});
	}
]);
