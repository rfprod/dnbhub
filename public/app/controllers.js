'use strict';
/* Controllers */

var dnbhubControllers = angular.module('dnbhubControllers', []);

dnbhubControllers.controller('navCtrl', ['$rootScope', '$scope', '$document', '$element', '$location', '$route', '$mdComponentRegistry', '$mdSidenav', '$mdDialog', 'firebaseService',
	function($rootScope, $scope, $document, $element, $location, $route, $mdComponentRegistry, $mdSidenav, $mdDialog, firebaseService) {
		$scope.title = 'Drum and Bass Hub';
		$scope.buttonTitles = {
			index: 'Index - Drum and Bass Hub index',
			singles: 'Singles - Soundcloud powered production showcase; all downloadable sounds are free for personal use and/or promotional purposes only',
			freedownloads: 'Free Downloads - Hive and Soundcloud powered section featuring freely downloadable music, produced by Dnbhub in-house artists',
			reposts: 'Featured - Soundcloud powered RePosts playlists featuring freely downloadable tracks',
			blog: 'Blog - Drum and Bass related press releases',
			about: 'All trademarks and copyrights are property of their respective owners',
			auth: 'Sign up / Log in',
			admin: 'Admin controls',
			user: 'User controls',
			signout: 'Sign out'
		};
		$scope.buttonIcons = {
			index: 'fa fa-fire',
			singles: 'fa fa-music',
			freedownloads: 'fa fa-cloud-download',
			reposts: 'fa fa-retweet',
			blog: 'fa fa-th-large',
			about: 'fa fa-copyright',
			auth: 'fa fa-sign-in',
			admin: 'fa fa-user-secret',
			user: 'fa fa-user-circle',
			signout: 'fa fa-sign-out'
		};
		$scope.currentYear = new Date().getFullYear();
		$scope.buttonNames = {
			index: 'Index',
			singles: 'Singles',
			freedownloads: 'Free Downloads',
			reposts: 'Featured',
			blog: 'Blog',
			about: '2011-'+$scope.currentYear,
			auth: 'Auth',
			admin: 'Admin',
			user: 'User',
			signout: 'Sign Out'
		};
		$scope.buttonHrefs = {
			index: 'index',
			singles: 'singles',
			freedownloads: 'freedownloads',
			reposts: 'reposts',
			blog: 'blog',
			admin: 'admin',
			user: 'user',
			about: 'about'
		};
		$scope.selectButton = (href) => {
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
		$scope.playSound = () => {
			$scope.speakerObj.setAttribute('src', $scope.sounds[0]);
			$scope.speakerObj.setAttribute('autoplay', 'autoplay');
			$scope.speakerObj.addEventListener('load', () => {
				$scope.speakerObj.play();
			}, true);
		};
		$scope.showAuthDialog = (event) => {
			// console.log('event', event);
			$mdDialog.show({
				controller: 'authDialogCtrl',
				templateUrl: './app/views/auth.html',
				parent: angular.element(document.body),
				targetEvent: event,
				clickOutsideToClose: ($location.$$path === '/user' && !$scope.firebase.isSignedIn) ? false : true,
				fullscreen: true
			}).then(
				(result) => console.log('submitted', result),
				(rejected) => console.log('closed', rejected)
			);
		};
		$scope.firebase = firebaseService;
		$scope.signout = () => {
			if ($scope.firebase.isSignedIn) {
				$scope.firebase.signout()
					.then(() => {
						console.log('signout success');
						if ($location.$$path === '/user') {
							$location.path('/index');
							$scope.$apply();
						} else {
							$route.reload();
						}
					})
					.catch((error) => {
						console.log('signout error', error);
						$route.reload();
					});
			}
		};
		$scope.disableToggler = () => {
			// console.log('$mdComponentRegistry.get(\'left\'):', $mdComponentRegistry.get('left'));
			return !$mdComponentRegistry.get('left');
		};
		$scope.toggleSidenav = () => {
			if ($mdComponentRegistry.get('left')) {
				$mdSidenav('left').toggle();
			}
		};
		$scope.isSidenavOpen = () => {
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
		/*
		*	event listener
		*/
		$rootScope.$on('showAuthDialog', (event) => {
			console.log('showAuthDialog, event', event);
			$scope.showAuthDialog(event);
		});
		$rootScope.$on('hideAuthDialog', (event) => {
			console.log('hideAuthDialog, event', event);
			$mdDialog.hide();
		});
		/*
		*	lifecycle
		*/
		$document.ready(() => {
			console.log('document ready');
			// console.log($element);
			$scope.speakerObj = $element[0].querySelector('#speaker');
		});
	}
]);

dnbhubControllers.controller('authDialogCtrl', ['$scope', '$mdDialog', '$location', '$timeout', 'regXpatternsService', 'firebaseService',
	function($scope, $mdDialog, $location, $timeout, regXpatternsService, firebaseService) {
		$scope.instructions = undefined;
		$scope.form = {
			email: '',
			password: ''
		};
		$scope.showPassword = false;
		$scope.togglePasswordVisibility = () => {
			$scope.showPassword = ($scope.showPassword) ? false : true;
		};
		$scope.patterns = regXpatternsService;
		$scope.firebase = firebaseService;

		$scope.loading = false;

		$scope.resetPassword = () => {
			console.log('send email with password reset link');
			$scope.loading = true;
			$scope.firebase.auth().sendPasswordResetEmail($scope.form.email)
				.then(() => {
					$scope.instructions = 'Password reset email was sent to ' + $scope.form.email + '. It may take some time for the email to be delivered. Request it again if you do not receive it in about 15 minutes.';
					// console.log('$scope.instructions:', $scope.instructions);
					$timeout(() => {
						$scope.loading = false;
					}, 1000);
					$scope.$apply();
				})
				.catch((error) => {
					console.log('reset user password, error:', error);
					$scope.instructions = error.message;
					// console.log('$scope.instructions:', $scope.instructions);
					$timeout(() => {
						$scope.loading = false;
					}, 1000);
					$scope.$apply();
				});
		};

		$scope.signupMode = false;
		$scope.wrongPassword = false;
		$scope.submit = (isValid) => {
			console.log('isValid', isValid);
			$scope.loading = true;
			if (isValid) {
				if (!$scope.signupMode) {
					$scope.firebase.authenticate('email', { email: $scope.form.email, password: $scope.form.password }).then(
						(/*user*/) => {
							// console.log('auth success', success);
							console.log('auth success');
							$mdDialog.hide(isValid);
							$location.url('/user');
						},
						(error) => {
							// console.log('auth error', error);
							console.log('auth error');
							if (error.code === 'auth/user-not-found') {
								$scope.instructions = 'We did not find an account registered with this email address. To create a new account hit a CREATE ACCOUNT button.';
								$scope.signupMode = true;
								$scope.wrongPassword = false;
							} else if (error.code === 'auth/wrong-password') {
								$scope.instructions = 'Password does not match an email address.';
								$scope.wrongPassword = true;
							} else {
								$scope.instructions = 'Unknown error occurred. Try again later.';
							}
							$timeout(() => {
								$scope.loading = false;
							}, 1000);
						}
					);
				} else {
					$scope.firebase.create('email', { email: $scope.form.email, password: $scope.form.password }).then(
						(user) => {
							// console.log('signup success', user);
							console.log('signup success');
							$mdDialog.hide(isValid);
							/*
							*	TODO verify user.uid instead of user.email
							*/
							if (user.email === 'connect@rfprod.tk') {
								$location.url('/admin');
							} else {
								$location.url('/user');
							}
						},
						(error) => {
							// console.log('signup error', error);
							console.log('signup error');
							$scope.instructions = 'An error occurred:', error.code;
							$timeout(() => {
								$scope.loading = false;
							}, 1000);
						}
					);
				}
			}
		};
		$scope.hide = () => {
			if (!$scope.disableDismissal) {
				$mdDialog.hide();
			}
		};
		$scope.cancel = () => {
			if (!$scope.disableDismissal) {
				$mdDialog.cancel();
			}
		};
		$scope.reset = () => {
			$scope.instructions = undefined;
			$scope.form.email = '';
			$scope.form.password = '';
			$scope.showPassword = false;
			$scope.signupMode = false;
		};
		$scope.disableDismissal = ($location.$$path === '/user' && !$scope.firebase.isSignedIn) ? true : false;
		/*
		*	lifecycle
		*/
		$scope.$on('$viewContentLoaded', () => {
			console.log('auth controller loaded');
		});
		$scope.$on('$destroy', () => {
			console.log('auth controller destroyed');
		});
	}
]);

dnbhubControllers.controller('indexCtrl', ['$scope',
	function($scope) {
		$scope.tracks = [];
		$scope.getTracks = (callback) => {
			SC.get('/users/1275637/tracks').then((tracks) => {
				$scope.tracks = tracks;
				$scope.$digest();
				callback();
			});
		};
		/*
		*	lifecycle
		*/
		$scope.$on('$viewContentLoaded', () => {
			console.log('index view controller loaded');
			$scope.getTracks(() => {
				console.log('got tracks');
			});
		});
		$scope.$on('$destroy', () => {
			console.log('index view controller destroyed');
		});
	}
]);

dnbhubControllers.controller('singlesCtrl', ['$scope',
	function($scope) {
		/*
		*	lifecycle
		*/
		$scope.$on('$viewContentLoaded', () => {
			console.log('singles view controller loaded');
		});
		$scope.$on('$destroy', () => {
			console.log('singles view controller destroyed');
		});
	}
]);

dnbhubControllers.controller('freeDownloadsCtrl', ['$scope', '$sce', '$location', '$mdSidenav', 'freedownloadsService', 'firebaseService',
	function($scope, $sce, $location, $mdSidenav, freedownloadsService, firebaseService) {
		$scope.freedownloadsData = [];
		$scope.selectedWidget = 1;
		$scope.scWidgetLink = {
			first: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/',
			last: '&amp;color=ff5500&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false'
		};
		$scope.widgetLink = (soundcloudTrackID) => {
			return $sce.trustAsResourceUrl($scope.scWidgetLink.first + soundcloudTrackID + $scope.scWidgetLink.last);
		};
		$scope.firebase = firebaseService;
		$scope.updateFreedownloadsData = () => {
			$scope.firebase.getDB('freedownloads').then((snapshot) => {
				console.log('freedownloads', snapshot.val());
				const response = snapshot.val();
				$scope.freedownloadsData = [];
				response.forEach((element) => {
					$scope.freedownloadsData.push(element);
				});
				$scope.welectedWidget = 0;
				// console.log('$scope.freedownloadsData:', $scope.freedownloadsData);
				$scope.$apply();
			}).catch((error) => {
				console.log('error', error);
				// fallback to static json hosted on client
				freedownloadsService.query({}).$promise.then((response) => {
					$scope.freedownloadsData = [];
					response.forEach((element) => {
						$scope.freedownloadsData.push(element);
					});
					$scope.welectedWidget = 0;
				});
				// console.log('$scope.freedownloadsData:', $scope.freedownloadsData);
				$scope.$apply();
			});
		};
		$scope.scrollToTrack = (widgetIndex) => {
			$scope.selectedWidget = widgetIndex;
			$location.$$hash = widgetIndex;
			$mdSidenav('left').toggle();
		};
		/*
		*	lifecycle
		*/
		$scope.$on('$viewContentLoaded', () => {
			console.log('free downloads view controller loaded');
			$scope.updateFreedownloadsData();
		});
		$scope.$on('$destroy', () => {
			console.log('free downloads view controller destroyed');
		});
	}
]);

dnbhubControllers.controller('repostsCtrl', ['$scope',
	function($scope) {
		/*
		*	lifecycle
		*/
		$scope.$on('$viewContentLoaded', () => {
			console.log('reposts view controller loaded');
		});
		$scope.$on('$destroy', () => {
			console.log('reposts view controller destroyed');
		});
	}
]);

dnbhubControllers.controller('blogCtrl', ['$scope', '$sce', '$route', '$location', '$mdDialog', 'blogPostsService', 'firebaseService',
	function($scope, $sce, $route, $location, $mdDialog, blogPostsService, firebaseService) {
		$scope.inputReleaseCode = undefined;
		$scope.blogPosts = [];
		$scope.selectedBlogPostId = 0;
		$scope.selectedBlogPost = {};
		$scope.disableBlogPostSelector = (direction) => {
			if (direction === 'previous') {
				return ($scope.selectedBlogPostId === $scope.blogPosts.length - 1) ? true : false;
			} else if (direction === 'next') {
				return ($scope.selectedBlogPostId === 0) ? true : false;
			}
		};
		$scope.widgetLink = {
			prefix: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/',
			suffix: '&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true'
		};
		$scope.returnWidgetLink = () => {
			return ($scope.selectedBlogPost.playlistId) ? $sce.trustAsResourceUrl($scope.widgetLink.prefix + $scope.selectedBlogPost.playlistId + $scope.widgetLink.suffix) : '#';
		};
		/*
		*	sidebar soundcloud player
		*/
		$scope.tracks = [];
		$scope.getTracks = (soundcloudUserId, callback) => {
			SC.get('/users/' + soundcloudUserId + '/tracks.json').then((tracks) => {
				$scope.tracks = tracks;
				$scope.$digest();
				callback();
			});
		};
		/*
		*	playlist details
		*/
		$scope.playlist = undefined;
		$scope.getPlaylistDetails = (playlistId, callback) => {
			$scope.playlist = undefined;
			SC.get('/playlists/' + playlistId).then((playlist) => {
				playlist.description = $scope.processDescription(playlist.description);
				$scope.playlist = playlist;
				// console.log('$scope.playlist:', $scope.playlist);
				$scope.$digest();
				callback();
			});
		};
		$scope.processDescription = (unprocessed) => {
			if (!unprocessed) { return unprocessed; }
			/*
			*	convert:
			*	\n to <br/>
			*	links to anchors
			*/
			const processed = unprocessed.replace(/\n/g, '<br/>')
				.replace(/((http(s)?)?(:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9@:%._+~#=]{0,255}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*))/g, '<a href="$1" target=_blank><i class="fa fa-external-link"></i> <span class="md-caption">$1</span></a>') // parse all urls, full and partial
				.replace(/href="((www\.)?[a-zA-Z0-9][-a-zA-Z0-9@:%._+~#=]{0,255}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*))"/g, 'href="http://$1"') // add to partial hrefs protocol prefix
				.replace(/(@)([^@,\s<)\]]+)/g, '<a href="https://soundcloud.com/$2" target=_blank><i class="fa fa-external-link"></i> <span class="md-caption">$1$2</span></a>');
			// console.log('processed', processed);
			return processed;
		};
		/*
		*	blog posts navigation
		*/
		$scope.setProperSearchParam = () => {
			const search = $location.search();
			if ($scope.selectedBlogPost) {
				search.code = $scope.selectedBlogPost.code;
				// console.log('location.search: ',search);
				$location.search(search);
			}
		};
		$scope.firebase = firebaseService;
		$scope.updateBlogPosts = (callback) => {
			$scope.firebase.getDB('blog').then((snapshot) => {
				console.log('blog', snapshot.val());
				const response = snapshot.val();
				$scope.blogPosts = [];
				response.forEach((element) => {
					$scope.blogPosts.push(element);
				});
				if ($scope.inputReleaseCode) {
					$scope.blogPosts.forEach((value, index) => {
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
				callback();
				$scope.$apply();
			}).catch((error) => {
				console.log('error', error);
				// fallback to static json hosted on client
				blogPostsService.query({}).$promise.then((response) => {
					$scope.blogPosts = [];
					response.forEach((element) => {
						$scope.blogPosts.push(element);
					});
					if ($scope.inputReleaseCode) {
						$scope.blogPosts.forEach((value, index) => {
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
				});
				callback();
				$scope.$apply();
			});
		};
		$scope.selectBlogPost = () => {
			if ($scope.blogPosts.length > 0) {
				$scope.selectedBlogPost = $scope.blogPosts[$scope.selectedBlogPostId];
				$scope.setProperSearchParam();
				$scope.getPlaylistDetails($scope.selectedBlogPost.playlistId, () => {
					console.log('got playlist details');
					$scope.getTracks($scope.selectedBlogPost.soundcloudUserId, () => {
						console.log('got user tracks');
					});
				});
			}
		};
		$scope.$watch('selectedBlogPostId', (newVal) => {
			console.log('selectedBlogPostId new val: ',newVal);
			if ($scope.selectedBlogPost && !$scope.inputReleaseCode) { $scope.selectBlogPost(); }
		});
		$scope.nextBlogPost = () => {
			if ($scope.selectedBlogPostId > 0) {
				$scope.selectedBlogPostId--;
			} else {
				console.log('this is a last blog post');
			}
		};
		$scope.previousBlogPost = () => {
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
		$scope.showAddBlogPostDialog = (event) => {
			console.log('event', event);
			$mdDialog.show({
				controller: 'addBlogPostDialogCtrl',
				templateUrl: './app/views/add-blog-post-dialog.html',
				parent: angular.element(document.body),
				targetEvent: event,
				clickOutsideToClose: false,
				fullscreen: true
			}).then(
				(result) => {
					console.log('result', result);
				},
				() => {
					console.log('dialog dismissed at', new Date().getTime());
				}
			);
		};
		/*
		*	lifecycle
		*/
		$scope.$on('$viewContentLoaded', () => {
			console.log('blog view controller loaded');
			const search = $location.search();
			if (search.code) {
				console.log('location.search: ',search);
				$scope.inputReleaseCode = search.code;
			}
			$scope.updateBlogPosts($scope.selectBlogPost);
		});
		$scope.$on('$destroy', () => {
			console.log('blog view controller destroyed');
		});
	}
]);

dnbhubControllers.controller('addBlogPostDialogCtrl', ['$scope', '$mdDialog', '$location', '$timeout', 'regXpatternsService', 'addBlogPostService',
	function($scope, $mdDialog, $location, $timeout, regXpatternsService, addBlogPostService) {
		$scope.form = {
			email: '',
			soundcloudPlaylistLink: ''
		};
		$scope.domain = $location.$$host;
		$scope.patterns = regXpatternsService;
		$scope.sendMailResponse = {error: '', success: ''};
		$scope.hide = () => {
			$mdDialog.hide();
		};
		$scope.cancel = () => {
			$mdDialog.cancel();
		};
		$scope.resetForm = () => {
			$scope.form.email = '';
			$scope.form.soundcloudPlaylistLink = '';
		};
		$scope.loading = false;
		$scope.submit = () => {
			$scope.loading = true;
			const params = 'email=' + $scope.form.email + '&link=' + $scope.form.soundcloudPlaylistLink + '&domain=' + $scope.domain;
			addBlogPostService.save({}, params).$promise.then(
				(response) => {
					if (response.success) {
						$scope.sendMailResponse.error = '';
						$scope.sendMailResponse.success = response.success || 'Message was successfully sent';
						$scope.resetForm();
					} else {
						$scope.sendMailResponse.error = response.error || 'Unknown error';
						$scope.sendMailResponse.success = '';
					}
					$timeout(() => {
						const hideDialog = ($scope.sendMailResponse.success) ? true : false;
						$scope.sendMailResponse.success = '';
						$scope.sendMailResponse.error = '';
						$scope.loading = false;
						if (hideDialog) {
							/*
							*	hide dialog on success only
							*/
							$scope.hide();
						}
					},5000);
				},
				(error) => {
					// console.log('sendMessage error: ', error);
					$scope.sendMailResponse.success = '';
					$scope.sendMailResponse.error = error.status + ' : ' + error.statusText;
					$timeout(() => {
						$scope.sendMailResponse.error = '';
						$scope.loading = false;
					},5000);
				}
			);
		};
		/*
		*	lifecycle
		*/
		$scope.$on('$viewContentLoaded', () => {
			console.log('add blog post dialog controller loaded');
		});
		$scope.$on('$destroy', () => {
			console.log('add blog post dialog controller destroyed');
		});
	}
]);

dnbhubControllers.controller('contactCtrl', ['$scope', '$mdDialog', '$location', '$anchorScroll', '$timeout', 'regXpatternsService', 'sendEmailService',
	function($scope, $mdDialog, $location, $anchorScroll, $timeout, regXpatternsService, sendEmailService) {
		$scope.email = '';
		$scope.name = '';
		$scope.header = '';
		$scope.message = '';
		$scope.domain = $location.$$host;
		$scope.buttonText = {reset: 'Reset all fields', submit: 'Send message', cancel: 'Cancel'};
		$scope.params = '';
		$scope.patterns = regXpatternsService;
		$scope.sendMailResponse = {error: '', success: ''};
		$scope.hideInstructions = false;
		$scope.switchInstructionsVisibility = () => {
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
		$scope.resetForm = () => {
			$scope.email = '';
			$scope.name = '';
			$scope.header = '';
			$scope.message = '';
		};
		$scope.loading = false;
		$scope.submitForm = () => {
			$scope.loading = true;
			$scope.params = 'name=' + $scope.name + '&email=' + $scope.email + '&header=' + $scope.header + '&message=' + $scope.message + '&domain=' + $scope.domain;
			sendEmailService.save({}, $scope.params).$promise.then(
				(response) => {
					// console.log(response);
					if (response.success) {
						$scope.sendMailResponse.error = '';
						$scope.sendMailResponse.success = response.success || 'Message was successfully sent';
						$scope.resetForm();
					} else {
						$scope.sendMailResponse.error = response.error || 'Unknown error';
						$scope.sendMailResponse.success = '';
					}
					$scope.scrollToSubmissionResult();
					$timeout(() => {
						$location.hash('');
						$scope.sendMailResponse.success = '';
						$scope.sendMailResponse.error = '';
						$scope.loading = false;
					},5000);
				},
				(error) => {
					// console.log('sendMessage error: ', error);
					$scope.sendMailResponse.success = '';
					$scope.sendMailResponse.error = error.status + ' : ' + error.statusText;
					$scope.scrollToSubmissionResult();
					$timeout(() => {
						$location.hash('');
						$scope.sendMailResponse.error = '';
						$scope.loading = false;
					},5000);
				}
			);
		};
		$scope.scrollToSubmissionResult = () => {
			$location.hash('submission-result');
			$anchorScroll();
		};
		/*
		*	dialog controls
		*/
		$scope.hide = () => {
			$location.hash('');
			$mdDialog.hide();
		};
		$scope.cancel = () => {
			$location.hash('');
			$mdDialog.cancel();
		};
		/*
		*	lifecycle
		*/
		$scope.$on('$viewContentLoaded', () => {
			console.log('contact view controller loaded');
		});
		$scope.$on('$destroy', () => {
			console.log('contact view controller destroyed');
		});
	}
]);

dnbhubControllers.controller('aboutCtrl', ['$scope', '$route', '$mdDialog', 'dnbhubDetailsService', 'firebaseService',
	function($scope, $route, $mdDialog, dnbhubDetailsService, firebaseService) {
		$scope.dnbhubDetails = {};
		$scope.firebase = firebaseService;
		$scope.updateDnbhubDetails = () => {
			$scope.firebase.getDB('about').then((snapshot) => {
				console.log('about', snapshot.val());
				const response = snapshot.val();
				$scope.dnbhubDetails = {};
				const keys = Object.keys(response);
				// console.log('keys, response:', keys, ',', response);
				keys.forEach((key) => {
					$scope.dnbhubDetails[key] = response[key];
				});
				// console.log('$scope.dnbhubDetails:', $scope.dnbhubDetails);
				$scope.$apply();
			}).catch((error) => {
				console.log('error', error);
				// fallback to static json hosted on client
				dnbhubDetailsService.query({}).$promise.then((response) => {
					$scope.dnbhubDetails = {};
					const keys = Object.keys(response);
					// console.log('keys, response:', keys, ',', response);
					keys.forEach((key) => {
						$scope.dnbhubDetails[key] = response[key];
					});
					// console.log('$scope.dnbhubDetails:', $scope.dnbhubDetails);
				});
				$scope.$apply();
			});
		};
		$scope.showContactDialog = (event) => {
			$mdDialog.show({
				controller: 'contactCtrl',
				templateUrl: './app/views/contact.html',
				parent: angular.element(document.body),
				targetEvent: event,
				clickOutsideToClose: false,
				fullscreen: true
			}).then(
				(result) => console.log('submitted', result),
				(rejected) => console.log('closed', rejected)
			);
		};
		/*
		*	lifecycle
		*/
		$scope.$on('$viewContentLoaded', () => {
			console.log('about view controller loaded');
			$scope.updateDnbhubDetails();
		});
		$scope.$on('$destroy', () => {
			console.log('about view controller destroyed');
		});
	}
]);

dnbhubControllers.controller('adminCtrl', ['$rootScope', '$scope', 'firebaseService',
	function($rootScope, $scope, firebaseService) {
		$scope.firebase = firebaseService;

		$scope.loading = false;
		$scope.currentTimeout = undefined;
		$scope.loaded = () => {
			if ($scope.currentTimeout) {
				clearTimeout($scope.currentTimeout);
			}
			$scope.currentTimeout = $timeout(() => {
				$scope.loading = false;
			}, 1000);
		};

		/*
		*	lifecycle
		*/
		$scope.$on('$viewContentLoaded', () => {
			console.log('admin view controller loaded');
			if (!$scope.firebase.isSignedIn) {
				$rootScope.$broadcast('showAuthDialog');
			} else {
				/*
				*	TODO
				*	init
				*/
			}
		});
		$scope.$on('$destroy', () => {
			console.log('admin view controller destroyed');
		});
	}
]);

dnbhubControllers.controller('userCtrl', ['$rootScope', '$scope', '$sce', '$window', '$timeout', '$location', '$mdDialog', 'firebaseService',
	function($rootScope, $scope, $sce, $window, $timeout, $location, $mdDialog, firebaseService) {
		$scope.instructions = '';
		$scope.firebase = firebaseService;
		$scope.currentUser = undefined;
		$scope.userDBrecord = undefined;
		$scope.mode = {
			edit: false,
			updateEmail: false
		};
		$scope.loading = false;
		$scope.currentTimeout = undefined;
		$scope.loaded = () => {
			if ($scope.currentTimeout) {
				clearTimeout($scope.currentTimeout);
			}
			$scope.currentTimeout = $timeout(() => {
				$scope.loading = false;
			}, 1000);
		};
		$scope.resendVerificationEmail = () => {
			$scope.loading = true;
			if (!$scope.currentUser.emailVerified) {
				$scope.firebase.user.sendEmailVerification()
					.then(() => {
						$scope.instructions = 'Check your email for an email with a verification link';
						// console.log('$scope.instructions:', $scope.instructions);
						$scope.loaded();
						$scope.$apply();
					})
					.catch((error) => {
						console.log('send email verification, error:', error);
						$scope.instructions = 'There was an error sending email verification';
						// console.log('$scope.instructions:', $scope.instructions);
						$scope.loaded();
						$scope.$apply();
					});
			} else {
				$scope.instructions = 'Your email is already verified';
				// console.log('$scope.instructions:', $scope.instructions);
			}
		};
		$scope.toggleEditMode = () => {
			$scope.mode.edit = ($scope.mode.edit) ? false : true;
			if (!$scope.mode.edit) {
				$scope.profile.email = $scope.currentUser.email;
				$scope.profile.name = $scope.currentUser.displayName;
			}
		};
		$scope.resetPassword = () => {
			console.log('send email with password reset link');
			$scope.loading = true;
			$scope.firebase.auth().sendPasswordResetEmail($scope.currentUser.email)
				.then(() => {
					$scope.instructions = 'Password reset email was sent to ' + $scope.currentUser.email;
					// console.log('$scope.instructions:', $scope.instructions);
					$scope.loaded();
					$scope.$apply();
				})
				.catch((error) => {
					console.log('reset user password, error:', error);
					$scope.instructions = 'There was an error while resetting your password, try again later';
					// console.log('$scope.instructions:', $scope.instructions);
					$scope.loaded();
					$scope.$apply();
				});
		};
		$scope.getDBuser = (passGetMeMethodCall) => {
			$scope.loading = true;
			$scope.firebase.getDB('users/' + $scope.currentUser.uid).then((snapshot) => {
				// console.log('users/' + $scope.currentUser.uid, snapshot.val());
				$scope.userDBrecord = snapshot.val();
				if ($scope.userDBrecord.sc_id && !passGetMeMethodCall) {
					$scope.getMe();
				}
				// console.log('$scope.userDBrecord', $scope.userDBrecord);
				$scope.instructions = '';
				$scope.loaded();
				$scope.$apply();
			}).catch((error) => {
				console.log('get user db record, error:', error);
				$scope.instructions = 'There was an error while getting user db record: ' + error;
				// console.log('$scope.instructions:', $scope.instructions);
				$scope.loaded();
				$scope.$apply();
			});
		};
		$scope.profile = {
			email: undefined,
			name: undefined,
			password: '' // is used if user wants to delete an account
		};
		$scope.updateProfile = () => {
			console.log('update profile');
			$scope.loading = true;
			$scope.currentUser.updateProfile({ displayName: $scope.profile.name })
				.then(() => {
					console.log('update profile, success');
					$scope.toggleEditMode();
					$scope.instructions = '';
					$scope.loaded();
					$scope.$apply();
				})
				.catch((error) => {
					console.log('update profile, error', error);
					$scope.instructions = 'There was an error while updating user profile.';
					// console.log('$scope.instructions:', $scope.instructions);
					$scope.loaded();
					$scope.$apply();
				});
		};
		$scope.deleteProfile = (event) => {
			if (!$scope.profile.password) {
				console.log('delete account, password missing');
				$scope.instructions = 'You must provide a password in order to delete your account';
				// console.log('$scope.instructions:', $scope.instructions);
			} else {
				$scope.instructions = '';
				$mdDialog.show(
					$mdDialog.confirm()
						.parent(angular.element(document.querySelector('#user')))
						.clickOutsideToClose(true)
						.title('Confirm account deletion')
						.textContent('This action can not be undone, all data related to this account will be deleted.')
						.ariaLabel('Confirm account deletion')
						.ok('Yes, delete my account')
						.cancel('Cancel')
						.targetEvent(event)
				).then((confirm) => {
					console.log('confirm deletion', confirm);
					$scope.loading = true;
					$scope.firebase.delete($scope.profile.email, $scope.profile.password).then(
						(success) => {
							console.log('account successfully deleted', success);
							$location.path('/index');
						}, (error) => {
							console.log('reauthenticate, error', error);
							$scope.instructions = 'There was an error while reauthenticating, it is required for an account deletion.';
							// console.log('$scope.instructions:', $scope.instructions);
						}
					);
				}, (cancel) => {
					console.log('cancel', cancel);
				});
			}
		};
		$scope.showPassword = false;
		$scope.togglePasswordVisibility = () => {
			$scope.showPassword = ($scope.showPassword) ? false : true;
		};
		/*
		*	connect with Soundcloud
		*/
		$scope.SCdata = {
			me: undefined,
			playlists: undefined
		};
		$scope.scConnect = () => {
			$scope.loading = true;
			SC.connect().then((/*data*/) => {
				// console.log('SC.connect.then, data:', data);
				// console.log('scConnect local storage', localStorage.getItem('callback'));
				const urlParams = localStorage.getItem('callback').replace(/^.*\?/, '').split('&');
				const code = urlParams[0].split('=')[1];
				const oauthToken = urlParams[1].split('#')[1].split('=')[1];
				localStorage.removeItem('callback');
				// console.log('scConnect local storage removed callback', localStorage.getItem('callback'));
				/*
				*	store user auth params for further oauth2/token requests
				*/
				$scope.firebase.setDBuserNewValues({ sc_code: code, sc_oauth_token: oauthToken })
					.then((data) => {
						console.log('setDBuserValues', JSON.stringify(data));
					})
					.catch((error) => {
						console.log('setDBuserValues, error', JSON.stringify(error));
					});
				return SC.get('/me');
			}).then((me) => {
				console.log('SC.me.then, me', me);
				$scope.SCdata.me = me;
				/*
				*	store user id to be able to retrieve user data without authentication
				*/
				$scope.firebase.setDBuserNewValues({ sc_id: me.id })
					.then((/*data*/) => {
						// console.log('setDBuserValues', JSON.stringify(data));
					})
					.catch((/*error*/) => {
						// console.log('setDBuserValues, error', JSON.stringify(error));
					});
				return SC.get('users/' + me.id + '/playlists');
			}).then((playlists) => {
				console.log('SC.playlists.then, playlists', playlists);
				$scope.SCdata.playlists = playlists;
				$scope.loaded();
				$scope.$apply();
				return playlists;
			});
		};
		$scope.getMe = () => {
			console.log('getMe, use has got a token');
			$scope.loading = true;
			SC.get('users/' + $scope.userDBrecord.sc_id)
				.then((me) => {
					console.log('SC.me.then, me', me);
					if (me.description) {
						me.description = $scope.processDescription(me.description);
					}
					$scope.SCdata.me = me;
					$scope.$apply();
					return SC.get('users/' + me.id + '/playlists');
				}).then((playlists) => {
					console.log('SC.playlists.then, playlists', playlists);
					$scope.SCdata.playlists = playlists;
					$scope.loaded();
					$scope.$apply();
					return playlists;
				});
		};
		$scope.scWidgetLink = {
			first: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/',
			last: '&amp;color=ff5500&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false'
		};
		$scope.widgetLink = (soundcloudPlaylistID) => {
			return $sce.trustAsResourceUrl($scope.scWidgetLink.first + soundcloudPlaylistID + $scope.scWidgetLink.last);
		};
		$scope.blogPostPreview = undefined;
		$scope.toggleBlogPostPreview = (arrayIndex) => {
			/*
			*	deselect if element does not exist
			*/
			// console.log('arrayIndex', arrayIndex);
			const post = $scope.SCdata.playlists[arrayIndex];
			if (post) {
				post.description = $scope.processDescription(post.description);
			}
			$scope.blogPostPreview = (post) ? post : undefined;
			// console.log('$scope.blogPostPreview', $scope.blogPostPreview);
		};
		$scope.processDescription = (unprocessed) => {
			if (!unprocessed) { return unprocessed; }
			/*
			*	convert:
			*	\n to <br/>
			*	links to anchors
			*/
			const processed = unprocessed.replace(/\n/g, '<br/>')
				.replace(/((http(s)?)?(:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9@:%._+~#=]{0,255}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*))/g, '<a href="$1" target=_blank><i class="fa fa-external-link"></i> <span class="md-caption">$1</span></a>') // parse all urls, full and partial
				.replace(/href="((www\.)?[a-zA-Z0-9][-a-zA-Z0-9@:%._+~#=]{0,255}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*))"/g, 'href="http://$1"') // add to partial hrefs protocol prefix
				.replace(/(@)([^@,\s<)\]]+)/g, '<a href="https://soundcloud.com/$2" target=_blank><i class="fa fa-external-link"></i> <span class="md-caption">$1$2</span></a>');
			// console.log('processed', processed);
			return processed;
		};
		$scope.existingBlogEntriesIDs = undefined;
		$scope.getExistingBlogEntriesIDs = () => {
			$scope.loading = true;
			$scope.firebase.getDB('blogEntriesIDs').then((snapshot) => {
				const response = snapshot.val();
				$scope.existingBlogEntriesIDs = response;
				console.log('$scope.existingBlogEntriesIDs', $scope.existingBlogEntriesIDs);
				$scope.loaded();
				$scope.$apply();
			}).catch((error) => {
				console.log('error', error);
				$scope.loaded();
				$scope.$apply();
			});
		};
		$scope.alreadyAdded = (arrayIndex) => {
			let added = false;
			if (!$scope.existingBlogEntriesIDs) {
				console.log('Unable to add blog posts, there was an error getting existing blog entries');
				added = true;
			} else {
				const post = $scope.SCdata.playlists[arrayIndex];
				if (post) {
					if ($scope.existingBlogEntriesIDs.hasOwnProperty(post.id) || $scope.alreadySubmitted(arrayIndex)) {
						added = true;
					}
				}
			}
			return added;
		};
		$scope.alreadySubmitted = (arrayIndex) => {
			let alreadySubmitted = false;
			const post = $scope.SCdata.playlists[arrayIndex];
			if (post) {
				if ($scope.userDBrecord.submittedPlaylists) {
					alreadySubmitted = ($scope.userDBrecord.submittedPlaylists.hasOwnProperty(post.id)) ? true : alreadySubmitted;
				}
			}
			return alreadySubmitted || $scope.alreadyAdded();
		};
		$scope.unsubmittable = (arrayIndex) => {
			let unsubmittable = false;
			const post = $scope.SCdata.playlists[arrayIndex];
			if (post) {
				if ($scope.userDBrecord.submittedPlaylists) {
					unsubmittable = (!$scope.userDBrecord.submittedPlaylists[post.id]) ? true : unsubmittable;
				}
			}
			return unsubmittable;
		};
		$scope.submitBlogPost = (arrayIndex) => {
			if (!$scope.existingBlogEntriesIDs) {
				console.log('Unable to add a blog post, there was an error getting existing blog entries');
			} else {
				console.log(`submit blog post, index ${arrayIndex}`);
				const post = $scope.SCdata.playlists[arrayIndex];
				const playlists = $scope.userDBrecord.submittedPlaylists || {};
				if (post) {
					playlists[post.id] = false; // false - submitted but not approved by a moderator, true - submitted and approved by a moderator
					$scope.loading = true;
					$scope.firebase.setDBuserNewValues({ submittedPlaylists: playlists })
						.then((data) => {
							console.log('submitBlogPost setDBuserValues', JSON.stringify(data));
							$scope.loaded();
							$scope.getDBuser(true);
						})
						.catch((error) => {
							console.log('submitBlogPost setDBuserValues, error', JSON.stringify(error));
							$scope.loaded();
						});
				}
			}
		};
		$scope.unsubmitBlogPost = (arrayIndex) => {
			if (!$scope.userDBrecord.submittedPlaylists) {
				console.log('No playlists to unsubmit');
			} else {
				console.log(`unsibmit blog post, index ${arrayIndex}`);
				const post = $scope.SCdata.playlists[arrayIndex];
				const playlists = $scope.userDBrecord.submittedPlaylists;
				if (post) {
					if (playlists.hasOwnProperty(post.id) && playlists[post.id] === false) {
						delete playlists[post.id];
						$scope.loading = true;
						$scope.firebase.setDBuserNewValues({ submittedPlaylists: playlists })
							.then((data) => {
								console.log('submitBlogPost setDBuserValues', JSON.stringify(data));
								$scope.loaded();
								$scope.getDBuser(true);
							})
							.catch((error) => {
								console.log('submitBlogPost setDBuserValues, error', JSON.stringify(error));
								$scope.loaded();
							});
					}
				}
			}
		};
		$scope.goToBlogEntry = () => {
			console.log('TODO: goToBlogEntry');
		};
		/*
		*	lifecycle
		*/
		$scope.$on('$viewContentLoaded', () => {
			console.log('user view controller loaded');
			if (!$scope.firebase.isSignedIn) {
				console.log('show auth dialog');
				$rootScope.$broadcast('showAuthDialog');
				$rootScope.$on('hideAuthDialog', () => {
					// console.log('$scope.firebase.user.providerData:', $scope.firebase.user.providerData);
					$scope.currentUser = $scope.firebase.auth().currentUser;
					if ($scope.currentUser) {
						$scope.profile.email = $scope.currentUser.email;
						$scope.profile.name = $scope.currentUser.displayName;
						$scope.getDBuser();
						$scope.getExistingBlogEntriesIDs();
					}
				});
			} else {
				$scope.currentUser = $scope.firebase.user;
				$scope.profile.email = $scope.currentUser.email;
				$scope.profile.name = $scope.currentUser.displayName;
				$scope.getDBuser();
				$scope.getExistingBlogEntriesIDs();
			}
		});
		$scope.$on('$destroy', () => {
			console.log('user view controller destroyed');
			$scope.firebase.getDB('blogEntriesIDs', true).off();
		});
	}
]);
