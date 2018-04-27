'use strict';

describe('Dnbhub controllers', () => {

	/*
	*	Soundcloud mock
	*/
	window.SC = {
		initialize: () => true,
		get: () => true
	};

	beforeEach(module('dnbhub'));

	describe('navController', () => {
		let scope, ctrl, doc, el, loc, compReg, sidenav, dialog, firebaseService;

		beforeEach(inject(($rootScope, $controller, _$document_, _$location_, _$mdComponentRegistry_, _$mdSidenav_, _$mdDialog_, _firebaseService_) => {
			scope = $rootScope.$new();
			doc = _$document_;
			el = angular.element('<div></div>');
			loc = _$location_;
			compReg = _$mdComponentRegistry_;
			sidenav = _$mdSidenav_;
			dialog = _$mdDialog_;
			firebaseService = _firebaseService_;
			ctrl = $controller('navController', { $scope: scope, $document: doc, $element: el, $location: loc, $mdComponentRegistry: compReg, $mdSidenav: sidenav, $mdDialog: dialog, firebaseService: firebaseService });
		}));

		it('should be defined', () => {
			expect(ctrl).toBeDefined();
		});

		it('should have variables and methods defined', () => {
			expect(scope.title).toEqual('Drum and Bass Hub');
			expect(scope.button).toEqual(jasmine.objectContaining({
				index: {
					name: 'Index',
					title: 'Index - Drum and Bass Hub index',
					icon: 'fa fa-fire',
					href: 'index'
				},
				singles: {
					name: 'Singles',
					title: 'Singles - Soundcloud powered production showcase; all downloadable sounds are free for personal use and/or promotional purposes only',
					icon: 'fa fa-music',
					href: 'singles'
				},
				freedownloads: {
					name: 'Free Downloads',
					title: 'Free Downloads - Hive and Soundcloud powered section featuring freely downloadable music, produced by Dnbhub in-house artists',
					icon: 'fa fa-cloud-download',
					href: 'freedownloads'
				},
				reposts: {
					name: 'RePosts',
					title: 'RePosts - Soundcloud powered playlists featuring freely downloadable tracks',
					icon: 'fa fa-retweet',
					href: 'reposts'
				},
				blog: {
					name: 'Blog',
					title: 'Blog - Drum and Bass related press releases',
					icon: 'fa fa-th-large',
					href: 'blog'
				},
				about: {
					name: '2011-' + new Date().getFullYear(),
					title: 'All trademarks and copyrights are property of their respective owners',
					icon: 'fa fa-copyright',
					href: 'about'
				},
				auth: {
					name: 'Auth',
					title: 'Sign up / Log in',
					icon: 'fa fa-sign-in',
					href: null
				},
				signout: {
					name: 'Sign Out',
					title: 'Sign out',
					icon: 'fa fa-sign-out',
					href: null
				},
				admin: {
					name: 'Admin',
					title: 'Admin controls',
					icon: 'fa fa-user-secret',
					href: 'admin'
				},
				user: {
					name: 'User',
					title: 'User controls',
					icon: 'fa fa-user-circle',
					href: 'user'
				}
			}));
			expect(scope.selectButton).toEqual(jasmine.any(Function));
			expect(scope.sounds).toEqual(jasmine.any(Array));
			expect(scope.sounds.length).toEqual(1);
			expect(scope.speakerObj).toEqual(null);
			expect(scope.playSound).toEqual(jasmine.any(Function));
			expect(scope.disableToggler).toEqual(jasmine.any(Function));
			expect(scope.toggleSidenav).toEqual(jasmine.any(Function));
			expect(scope.isSidenavOpen).toEqual(jasmine.any(Function));
		});
	});

	describe('indexController', () => {
		let scope, ctrl, soundcloudService;

		beforeEach(inject(($rootScope, $controller, _soundcloudService_) => {
			scope = $rootScope.$new();
			soundcloudService = _soundcloudService_;
			ctrl = $controller('indexController', { $scope: scope, soundcloudService: soundcloudService });
		}));

		it('should be defined', () => {
			expect(ctrl).toBeDefined();
		});

		it('should have variables and methods defined', () => {
			expect(scope.tracks).toEqual(jasmine.any(Array));
			expect(scope.tracks.length).toEqual(0);
			expect(scope.getTracks).toEqual(jasmine.any(Function));
		});

	});

	describe('singlesController', () => {
		let scope, ctrl;

		beforeEach(inject(($rootScope, $controller) => {
			scope = $rootScope.$new();
			ctrl = $controller('singlesController', { $scope: scope });
		}));

		it('should be defined', () => {
			expect(ctrl).toBeDefined();
		});

	});

	describe('freedownloadsController', () => {
		let scope, ctrl, loc, sidenav, firebaseService, soundcloudService;

		beforeEach(inject(($rootScope, $controller, _$location_, _$mdSidenav_, _firebaseService_, _soundcloudService_) => {
			scope = $rootScope.$new();
			loc = _$location_;
			sidenav = _$mdSidenav_;
			soundcloudService = _soundcloudService_;
			firebaseService = _firebaseService_;
			ctrl = $controller('freeDownloadsController', { $scope: scope, $location: loc, $mdSidenav: sidenav, firebaseService: firebaseService, soundcloudService: soundcloudService });
		}));

		it('should be defined', () => {
			expect(ctrl).toBeDefined();
		});

		it('should have variables and methods defined', () => {
			expect(scope.freedownloadsData).toEqual(jasmine.any(Array));
			expect(scope.freedownloadsData.length).toEqual(0);
			expect(scope.selectedWidget).toEqual(1);
			expect(scope.scService).toEqual(jasmine.any(Object));
			expect(scope.widgetLink).toEqual(jasmine.any(Function));
			expect(scope.firebase).toEqual(firebaseService);
			expect(scope.updateFreedownloadsData).toEqual(jasmine.any(Function));
			expect(scope.scrollToTrack).toEqual(jasmine.any(Function));
		});

	});

	describe('repostsController', () => {
		let scope, ctrl;

		beforeEach(inject(($rootScope, $controller) => {
			scope = $rootScope.$new();
			ctrl = $controller('repostsController', { $scope: scope });
		}));

		it('should be defined', () => {
			expect(ctrl).toBeDefined();
		});

	});

	describe('blogController', () => {
		let scope, ctrl, route, loc, sidenav, firebaseService, soundcloudService;

		beforeEach(inject(($rootScope, $controller, _$route_, _$location_, _$mdSidenav_, _firebaseService_, _soundcloudService_) => {
			scope = $rootScope.$new();
			route = _$route_;
			loc = _$location_;
			sidenav = _$mdSidenav_;
			firebaseService = _firebaseService_;
			soundcloudService = _soundcloudService_;
			ctrl = $controller('blogController', { $scope: scope, $route: route, $location: loc, $mdSidenav: sidenav, firebaseService: firebaseService, soundcloudService: soundcloudService });
		}));

		it('should be defined', () => {
			expect(ctrl).toBeDefined();
		});

		it('should have variables and methods defined', () => {
			expect(scope.inputReleaseCode).toBeUndefined();
			expect(scope.blogPosts).toEqual(jasmine.any(Array));
			expect(scope.blogPosts.length).toEqual(0);
			expect(scope.selectedBlogPostId).toEqual(0);
			expect(scope.selectedBlogPost).toEqual(jasmine.objectContaining({}));
			expect(scope.disableBlogPostSelector).toEqual(jasmine.any(Function));
			expect(scope.widgetLink).toEqual(jasmine.any(Function));
			expect(scope.tracks).toEqual(jasmine.any(Array));
			expect(scope.tracks.length).toEqual(0);
			expect(scope.getTracks).toEqual(jasmine.any(Function));
			expect(scope.setProperSearchParam).toEqual(jasmine.any(Function));
			expect(scope.firebase).toEqual(firebaseService);
			expect(scope.updateBlogPosts).toEqual(jasmine.any(Function));
			expect(scope.selectBlogPost).toEqual(jasmine.any(Function));
			expect(scope.nextBlogPost).toEqual(jasmine.any(Function));
			expect(scope.previousBlogPost).toEqual(jasmine.any(Function));
			expect(scope.actions).toEqual(jasmine.objectContaining({
				open: false
			}));
			expect(scope.showAddBlogPostDialog).toEqual(jasmine.any(Function));
		});

	});

	describe('addBlogPostDialogController', () => {
		let scope, ctrl, dialog, location, timeout, regXpatternsService, addBlogPostService;

		beforeEach(inject(($rootScope, $controller, _$mdDialog_, _$location_, _$timeout_, _regXpatternsService_, _addBlogPostService_) => {
			scope = $rootScope.$new();
			dialog = _$mdDialog_;
			location = _$location_;
			timeout = _$timeout_;
			regXpatternsService = _regXpatternsService_;
			addBlogPostService = _addBlogPostService_;
			spyOn(addBlogPostService,'save').and.callFake(() => []);
			ctrl = $controller('addBlogPostDialogController', { $scope: scope, $mdDialog: dialog, $location: location, $timeout: timeout, regXpatternsService: regXpatternsService, addBlogPostService: addBlogPostService });
		}));

		it('should be defined', () => {
			expect(ctrl).toBeDefined();
		});

		it('should have variables and methods defined', () => {
			expect(scope.form).toEqual(jasmine.objectContaining({
				email: jasmine.any(String),
				soundcloudPlaylistLink: jasmine.any(String)
			}));
			expect(scope.patterns).toEqual(regXpatternsService);
			expect(scope.sendMailResponse).toEqual(jasmine.objectContaining({
				error: jasmine.any(String),
				success: jasmine.any(String)
			}));
			expect(scope.hide).toEqual(jasmine.any(Function));
			expect(scope.cancel).toEqual(jasmine.any(Function));
			expect(scope.submit).toEqual(jasmine.any(Function));
		});

	});

	describe('contactController', () => {
		let scope, ctrl, location, timeout, regXpatternsService, sendEmailService;

		beforeEach(inject(($rootScope, $controller, _$location_, _$timeout_, _regXpatternsService_, _sendEmailService_) => {
			scope = $rootScope.$new();
			location = _$location_;
			timeout = _$timeout_;
			regXpatternsService = _regXpatternsService_;
			sendEmailService = _sendEmailService_;
			spyOn(sendEmailService,'save').and.callFake(() => []);
			ctrl = $controller('contactController', { $scope: scope, $location: location, $timeout: timeout, regXpatternsService: regXpatternsService, sendEmailService: sendEmailService });
		}));

		it('should be defined', () => {
			expect(ctrl).toBeDefined();
		});

		it('should have variables and methods defined', () => {
			expect(scope.email).toEqual(jasmine.any(String));
			expect(scope.name).toEqual(jasmine.any(String));
			expect(scope.header).toEqual(jasmine.any(String));
			expect(scope.message).toEqual(jasmine.any(String));
			expect(scope.buttonText).toEqual(jasmine.objectContaining({
				reset: jasmine.any(String),
				submit: jasmine.any(String)
			}));
			expect(scope.params).toEqual(jasmine.any(String));
			expect(scope.patterns).toEqual(regXpatternsService);
			expect(scope.sendMailResponse).toEqual(jasmine.objectContaining({
				error: jasmine.any(String),
				success: jasmine.any(String)
			}));
			expect(scope.hideInstructions).toBeFalsy();
			expect(scope.switchInstructionsVisibility).toEqual(jasmine.any(Function));
			expect(scope.instructions).toEqual(jasmine.objectContaining({
				intro: jasmine.any(String),
				list: jasmine.any(Array)
			}));
			expect(scope.resetForm).toEqual(jasmine.any(Function));
			expect(scope.submitForm).toEqual(jasmine.any(Function));
		});

	});

	describe('aboutController', () => {
		let scope, ctrl, route, firebaseService;

		beforeEach(inject(($rootScope, $controller, _$route_, _firebaseService_) => {
			scope = $rootScope.$new();
			route = _$route_;
			firebaseService = _firebaseService_;
			ctrl = $controller('aboutController', { $scope: scope, $route: route, firebaseService: firebaseService });
		}));

		it('should be defined', () => {
			expect(ctrl).toBeDefined();
		});

		it('should have variables and methods defined', () => {
			expect(scope.dnbhubDetails).toEqual(jasmine.objectContaining({}));
			expect(scope.firebase).toEqual(firebaseService);
			expect(scope.updateDnbhubDetails).toEqual(jasmine.any(Function));
		});

	});

});
