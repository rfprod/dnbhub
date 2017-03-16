/* Controllers */

var dnbhubControllers = angular.module('dnbhubControllers', ['angularSpinner']);

dnbhubControllers.controller('navCtrl', ['$scope', '$document', '$element', '$location', 'usSpinnerService',
	function($scope, $document, $element, $location, usSpinnerService) {
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
		$scope.buttonGlyphicons = {
			index: 'glyphicon glyphicon-fire',
			singles: 'glyphicon glyphicon-music',
			freedownloads: 'glyphicon glyphicon-cloud-download',
			reposts: 'glyphicon glyphicon-retweet',
			blog: 'glyphicon glyphicon-th-large',
			contact: 'glyphicon glyphicon-envelope',
			about: 'glyphicon glyphicon-copyright-mark'
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
		$scope.sounds = ['../sounds/blip.mp3'];
		$scope.speakerObj = null;
		$scope.navButtons = [];
		$scope.$watch(function() {return $location.path();}, function(next,previous) {
			//console.log('location changed: ',previous,next);
			if ($scope.navButtons.length > 0){
				for (var i = 0; i < $scope.navButtons.length; i++) {
					if ($scope.navButtons[i].innerHTML.indexOf(previous.slice(1)) !== -1) { $scope.navButtons[i].setAttribute('class','nav-tabs'); }
					if ($scope.navButtons[i].innerHTML.indexOf(next.slice(1)) !== -1) { $scope.navButtons[i].setAttribute('class','nav-tabs active'); }
				}
			}
		});
		$scope.playSound = function() {
			$scope.speakerObj.setAttribute('src', $scope.sounds[0]);
			$scope.speakerObj.setAttribute('autoplay', 'autoplay');
			$scope.speakerObj.addEventListener('load', function() {
				$scope.speakerObj.play();
			}, true);
		};
		$document.ready(function() {
			console.log('document ready');
			usSpinnerService.spin('root-spinner');
			//console.log($element);
			$scope.speakerObj = $element[0].children[0];
			$scope.navButtons = $element[0].children[1].querySelector('#tabs').querySelectorAll('li');
			if ($scope.navButtons.length > 0){
				for (var i=0; i<$scope.navButtons.length; i++){
					if ($scope.navButtons[i].innerHTML.indexOf($location.path().slice(1)) !== -1) { $scope.navButtons[i].setAttribute('class','nav-tabs active'); }
				}
			}
		});
	}
]);

dnbhubControllers.controller('indexCtrl', ['$scope', '$route', 'usSpinnerService',
	function($scope, $route, usSpinnerService) {
		'use strict';
		$scope.getTracks = function(callback) {
			SC.initialize({ client_id: 'dc01ec1b4ea7d41793e61bac1dae13c5' });
			var trackSingle = '';
			var trackList = '<br/><iframe id="player_progress" name="player" src=""></iframe><br/><div id="header"><div></div><span id="stream_url"><span class="glyphicon glyphicon-play" aria-hidden="true"></span></span><span id="download_url"><span class="glyphicon glyphicon-save" aria-hidden="true"></span></span><span id="playback_count">plays</span><span id="favoritings_count">favoritings</span></div>';
			SC.get('http://api.soundcloud.com/users/1275637/tracks.json?client_id=dc01ec1b4ea7d41793e61bac1dae13c5', function(tracks) {
				for (var i = 0; i < tracks.length; i++) {
					if (tracks[i].downloadable === true) {
						// if the track is downloadable include download link
						if (tracks[i].license === 'all-rights-reserved') {
							// if license is all-rights-reserved - download preview
							trackSingle = '<div id="line"><div id="title">' + tracks[i].title + '</div><div id="genre" class="right">' + tracks[i].genre + '</div><span id="stream_url"><a href="' + tracks[i].stream_url + '?client_id=dc01ec1b4ea7d41793e61bac1dae13c5" target="player"><span class="glyphicon glyphicon-play" aria-hidden="true"></span></a></span><span id="download_url"><a href="' + tracks[i].download_url + '?client_id=dc01ec1b4ea7d41793e61bac1dae13c5" target=_blank><span class="glyphicon glyphicon-save" aria-hidden="true"></span></a></span><span id="playback_count">' + tracks[i].playback_count + '</span><span id="favoritings_count">' + tracks[i].favoritings_count + '</span></div>';
						} else {
							trackSingle = '<div id="line"><div id="title">' + tracks[i].title + '</div><div id="genre" class="right">' + tracks[i].genre + '</div><span id="stream_url"><a href="' + tracks[i].stream_url + '?client_id=dc01ec1b4ea7d41793e61bac1dae13c5" target="player"><span class="glyphicon glyphicon-play" aria-hidden="true"></span></a></span><span id="download_url"><a href="' + tracks[i].download_url + '?client_id=dc01ec1b4ea7d41793e61bac1dae13c5" target=_blank><span class="glyphicon glyphicon-save" aria-hidden="true"></span></a></span><span id="playback_count">' + tracks[i].playback_count + '</span><span id="favoritings_count">' + tracks[i].favoritings_count + '</span></div>';
						}
					} else {
						// if the track is not downloadable
						// check if there's a purchase url
						if (tracks[i].purchase_url !== null) {
							trackSingle = '<div id="line"><div id="title">' + tracks[i].title + '</div><div id="genre" class="right">' + tracks[i].genre + '</div><span id="stream_url"><a href="' + tracks[i].stream_url + '?client_id=dc01ec1b4ea7d41793e61bac1dae13c5" target="player"><span class="glyphicon glyphicon-play" aria-hidden="true"></span></a></span><span id="download_url"><a href="' + tracks[i].purchase_url + '" target=_blank><span class="glyphicon glyphicon-save" aria-hidden="true"></span></a></span><span id="playback_count">' + tracks[i].playback_count + '</span><span id="favoritings_count">' + tracks[i].favoritings_count + '</span></div>';
						} else {
							trackSingle = '<div id="line"><div id="title">' + tracks[i].title + '</div><div id="genre">' + tracks[i].genre + '</div><span id="stream_url"><a href="' + tracks[i].stream_url + '?client_id=dc01ec1b4ea7d41793e61bac1dae13c5" target="player"><span class="glyphicon glyphicon-play" aria-hidden="true"></span></a></span><span id="download_url"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span><span id="playback_count">' + tracks[i].playback_count + '</span><span id="favoritings_count">' + tracks[i].favoritings_count + '</span></div>';
						}
					}
					trackList = trackList.concat(trackSingle);
				}
				trackList = trackList.concat('</span>');
				document.getElementById('sc_player').innerHTML = trackList;
				callback();
			});
		};
		$scope.adaptInternalsOnLoad = function() {
			$('#sc_player').height($('html').height()-190); // 190 - rendered maichimp form height
		};
		$scope.$on('$viewContentLoaded', function() {
			console.log('index view controller loaded');
			$scope.getTracks(function() {
				$scope.adaptInternalsOnLoad();
				usSpinnerService.stop('root-spinner');
			});
		});
		$scope.$on('$destroy', function() {
			console.log('index view controller destroyed');
			usSpinnerService.spin('root-spinner');
		});
		window.addEventListener('resize', function() {
			$scope.$apply(function() {
				$route.reload();
			});
		}, true);
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

dnbhubControllers.controller('freeDownloadsCtrl', ['$scope', '$sce', '$location', 'usSpinnerService', 'freedownloadsService',
	function($scope, $sce, $location, usSpinnerService, freedownloadsService) {
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

dnbhubControllers.controller('blogCtrl', ['$scope', '$sce', '$route', '$location', 'usSpinnerService', 'blogPostsService',
	function($scope, $sce, $route, $location, usSpinnerService, blogPostsService) {
		'use strict';
		$scope.inputReleaseCode = undefined;
		$scope.blogPosts = [];
		$scope.selectedBlogPostId = 0;
		$scope.selectedBlogPost = {};
		$scope.returnWidgetLink = function() {
			return $sce.trustAsResourceUrl($scope.selectedBlogPost.widgetLink);
		};
		$scope.getTracks = function(soundcloudUserId,callback) {
			SC.initialize({
				client_id: 'dc01ec1b4ea7d41793e61bac1dae13c5',
			});
			var trackSingle = '';
			var trackList = '<br/><iframe id="player_progress" name="player" src=""></iframe><br/><div id="header"><div></div><span id="stream_url"><span class="glyphicon glyphicon-play" aria-hidden="true"></span></span><span id="download_url"><span class="glyphicon glyphicon-save" aria-hidden="true"></span></span><span id="playback_count">plays</span><span id="favoritings_count">favoritings</span></div>';
			SC.get('http://api.soundcloud.com/users/'+soundcloudUserId+'/tracks.json?client_id=dc01ec1b4ea7d41793e61bac1dae13c5', function(tracks) {
				for (var i = 0; i < tracks.length; i++) {
					if (tracks[i].downloadable === true) {
						// if the track is downloadable include download link
						if (tracks[i].license === 'all-rights-reserved'){
							// if license is all-rights-reserved - download preview
							trackSingle = '<div id="line"><div id="title">' + tracks[i].title + '</div><div id="genre" class="right">' + tracks[i].genre + '</div><span id="stream_url"><a href="' + tracks[i].stream_url + '?client_id=dc01ec1b4ea7d41793e61bac1dae13c5" target="player"><span class="glyphicon glyphicon-play" aria-hidden="true"></span></a></span><span id="download_url"><a href="' + tracks[i].download_url + '?client_id=dc01ec1b4ea7d41793e61bac1dae13c5" target=_blank><span class="glyphicon glyphicon-save" aria-hidden="true"></span></a></span><span id="playback_count">' + tracks[i].playback_count + '</span><span id="favoritings_count">' + tracks[i].favoritings_count + '</span></div>';
						} else {
							trackSingle = '<div id="line"><div id="title">' + tracks[i].title + '</div><div id="genre" class="right">' + tracks[i].genre + '</div><span id="stream_url"><a href="' + tracks[i].stream_url + '?client_id=dc01ec1b4ea7d41793e61bac1dae13c5" target="player"><span class="glyphicon glyphicon-play" aria-hidden="true"></span></a></span><span id="download_url"><a href="' + tracks[i].download_url + '?client_id=dc01ec1b4ea7d41793e61bac1dae13c5" target=_blank><span class="glyphicon glyphicon-save" aria-hidden="true"></span></a></span><span id="playback_count">' + tracks[i].playback_count + '</span><span id="favoritings_count">' + tracks[i].favoritings_count + '</span></div>';
						}
					} else {
						// if the track is not downloadable
						// check if there's a purchase url
						if (tracks[i].purchase_url !== null) {
							trackSingle = '<div id="line"><div id="title">' + tracks[i].title + '</div><div id="genre" class="right">' + tracks[i].genre + '</div><span id="stream_url"><a href="' + tracks[i].stream_url + '?client_id=dc01ec1b4ea7d41793e61bac1dae13c5" target="player"><span class="glyphicon glyphicon-play" aria-hidden="true"></span></a></span><span id="download_url"><a href="' + tracks[i].purchase_url + '" target=_blank><span class="glyphicon glyphicon-save" aria-hidden="true"></span></a></span><span id="playback_count">' + tracks[i].playback_count + '</span><span id="favoritings_count">' + tracks[i].favoritings_count + '</span></div>';
						} else {
							trackSingle = '<div id="line"><div id="title">' + tracks[i].title + '</div><div id="genre">' + tracks[i].genre + '</div><span id="stream_url"><a href="' + tracks[i].stream_url + '?client_id=dc01ec1b4ea7d41793e61bac1dae13c5" target="player"><span class="glyphicon glyphicon-play" aria-hidden="true"></span></a></span><span id="download_url"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span><span id="playback_count">' + tracks[i].playback_count + '</span><span id="favoritings_count">' + tracks[i].favoritings_count + '</span></div>';
						}
					}
					trackList = trackList.concat(trackSingle);
				}
				trackList = trackList.concat('</span>');
				document.getElementById('sc_player').innerHTML = trackList;
				callback();
			});
		};
		$scope.adaptInternalsOnLoad = function() {
			var navbarHeight = $('nav').height();
			var windowHeight = $('html').height();
			var headingHeight = $('.post .heading').height() + $('.post .heading').css('margin-top') + $('.post .heading').css('margin-bottom');
			var h = windowHeight-navbarHeight-headingHeight;
			$('.post .text').height(h);
			$('.post .widget').height(h);
			$('#sc_player').height(windowHeight-190); // 190 - rendered maichimp form height
		};
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
				//console.log($scope.blogPosts);
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
					$scope.adaptInternalsOnLoad();
					usSpinnerService.stop('root-spinner');
				});
			});
		};
		$scope.selectBlogPost = function() {
			if ($scope.blogPosts.length > 0) {
				usSpinnerService.spin('root-spinner');
				$scope.selectedBlogPost = $scope.blogPosts[$scope.selectedBlogPostId];
				//console.log('selectedBlogPost: ',$scope.selectedBlogPost);
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
				//$scope.selectBlogPost();
			}console.log('this is last blog post');
		};
		$scope.previousBlogPost = function() {
			if ($scope.selectedBlogPostId < $scope.blogPosts.length-1) {
				$scope.selectedBlogPostId++;
				//$scope.selectBlogPost();
			}console.log('this is first blog post');
		};
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
		window.addEventListener('resize', function() {
			$scope.$apply(function() {
				$route.reload();
			});
		}, true);
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
			list: '<li>make an info support request - have a blog post for your upcoming release;</li><li>make a collaboration or hire request - work with us in the context of audio production from scratch or remixing;</li><li>make a licencing request - use music, published by Dnbhub, for your needs;</li><li>make any other request - did we miss something?</li>'
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
		$scope.adaptInternalsOnLoad = function() {
			var navbarHeight = $('nav').height();
			var windowHeight = $('html').height();
			var headingHeight = $('#data-container .heading').height()+$('#data-container .heading').css('margin-top')+$('#data-container .heading').css('margin-bottom');
			var h = windowHeight-navbarHeight-headingHeight;
			$('.text').height(h);
			$('#data-container .widget').height(h);
			$('#powered_by').height(windowHeight-190); // 190px - rendered mailchimp form height
		};
		$scope.dnbhubDetails = {};
		$scope.updateDnbhubDetails = function() {
			dnbhubDetailsService.query({}).$promise.then(function(response) {
				$scope.dnbhubDetails = {};
				var keys = Object.keys(response);
				console.log(keys,response);
				keys.forEach(function(key) {
					$scope.dnbhubDetails[key] = response[key];
				});
				console.log($scope.dnbhubDetails);
				$scope.adaptInternalsOnLoad();
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
		window.addEventListener('resize', function() {
			$scope.$apply(function() {
				$route.reload();
			});
		}, true);
	}
]);
