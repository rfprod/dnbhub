'use strict';

describe('Dnbhub controllers', function() {

	/*
	*	Soundcloud mock
	*/
	window.SC = {
		initialize: function() { return true; },
		get: function() { return true; }
	};

	beforeEach(module('dnbhub'));

	describe('navCtrl', function() {
		var scope, ctrl, doc, el, loc, compReg, sidenav, dialog, firebaseService;

		beforeEach(inject(function($rootScope, $controller, _$document_, _$location_, _$mdComponentRegistry_, _$mdSidenav_, _$mdDialog_, _firebaseService_) {
			scope = $rootScope.$new();
			doc = _$document_;
			el = angular.element('<div></div>');
			loc = _$location_;
			compReg = _$mdComponentRegistry_;
			sidenav = _$mdSidenav_;
			dialog = _$mdDialog_;
			firebaseService = _firebaseService_;
			ctrl = $controller('navCtrl', { $scope: scope, $document: doc, $element: el, $location: loc, $mdComponentRegistry: compReg, $mdSidenav: sidenav, $mdDialog: dialog, firebaseService: firebaseService });
		}));

		it('should be defined', function() {
			expect(ctrl).toBeDefined();
		});

		it('should have variables and methods defined', function() {
			expect(scope.title).toEqual('Drum and Bass Hub');
			expect(scope.buttonTitles).toEqual(jasmine.objectContaining({
				index: jasmine.any(String),
				singles: jasmine.any(String),
				freedownloads: jasmine.any(String),
				reposts: jasmine.any(String),
				blog: jasmine.any(String),
				contact: jasmine.any(String),
				about: jasmine.any(String)
			}));
			expect(scope.buttonIcons).toEqual(jasmine.objectContaining({
				index: jasmine.any(String),
				singles: jasmine.any(String),
				freedownloads: jasmine.any(String),
				reposts: jasmine.any(String),
				blog: jasmine.any(String),
				contact: jasmine.any(String),
				about: jasmine.any(String)
			}));
			expect(scope.currentYear).toBeDefined();
			expect(scope.buttonNames).toEqual(jasmine.objectContaining({
				index: jasmine.any(String),
				singles: jasmine.any(String),
				freedownloads: jasmine.any(String),
				reposts: jasmine.any(String),
				blog: jasmine.any(String),
				contact: jasmine.any(String),
				about: jasmine.any(String)
			}));
			expect(scope.buttonHrefs).toEqual(jasmine.objectContaining({
				index: jasmine.any(String),
				singles: jasmine.any(String),
				freedownloads: jasmine.any(String),
				reposts: jasmine.any(String),
				blog: jasmine.any(String),
				contact: jasmine.any(String),
				about: jasmine.any(String)
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

	describe('indexCtrl', function() {
		var scope, ctrl, soundcloudService;

		beforeEach(inject(function($rootScope, $controller, _soundcloudService_) {
			scope = $rootScope.$new();
			soundcloudService = _soundcloudService_;
			ctrl = $controller('indexCtrl', { $scope: scope, soundcloudService: soundcloudService });
		}));

		it('should be defined', function() {
			expect(ctrl).toBeDefined();
		});

		it('should have variables and methods defined', function() {
			expect(scope.tracks).toEqual(jasmine.any(Array));
			expect(scope.tracks.length).toEqual(0);
			expect(scope.getTracks).toEqual(jasmine.any(Function));
		});

	});

	describe('singlesCtrl', function() {
		var scope, ctrl;

		beforeEach(inject(function($rootScope, $controller) {
			scope = $rootScope.$new();
			ctrl = $controller('singlesCtrl', { $scope: scope });
		}));

		it('should be defined', function() {
			expect(ctrl).toBeDefined();
		});

	});

	describe('freedownloadsCtrl', function() {
		var scope, ctrl, sce, loc, sidenav, freedownloadsService, firebaseService;

		beforeEach(inject(function($rootScope, $controller, _$sce_, _$location_, _$mdSidenav_, _freedownloadsService_, _firebaseService_) {
			scope = $rootScope.$new();
			sce = _$sce_;
			loc = _$location_;
			sidenav = _$mdSidenav_;
			freedownloadsService = _freedownloadsService_;
			spyOn(freedownloadsService,'query').and.callFake(function() { return []; });
			firebaseService = _firebaseService_;
			ctrl = $controller('freeDownloadsCtrl', { $scope: scope, $sce: sce, $location: loc, $mdSidenav: sidenav, freedownloadsService: freedownloadsService, firebaseService: firebaseService });
		}));

		it('should be defined', function() {
			expect(ctrl).toBeDefined();
		});

		it('should have variables and methods defined', function() {
			expect(scope.freedownloadsData).toEqual(jasmine.any(Array));
			expect(scope.freedownloadsData.length).toEqual(0);
			expect(scope.selectedWidget).toEqual(1);
			expect(scope.scWidgetLink).toEqual(jasmine.objectContaining({
				first: jasmine.any(String),
				last: jasmine.any(String)
			}));
			expect(scope.widgetLink).toEqual(jasmine.any(Function));
			expect(scope.firebase).toEqual(firebaseService);
			expect(scope.updateFreedownloadsData).toEqual(jasmine.any(Function));
			expect(scope.scrollToTrack).toEqual(jasmine.any(Function));
		});

	});

	describe('repostsCtrl', function() {
		var scope, ctrl;

		beforeEach(inject(function($rootScope, $controller) {
			scope = $rootScope.$new();
			ctrl = $controller('repostsCtrl', { $scope: scope });
		}));

		it('should be defined', function() {
			expect(ctrl).toBeDefined();
		});

	});

	describe('blogCtrl', function() {
		var scope, ctrl, sce, route, loc, sidenav, blogPostsService, firebaseService, soundcloudService;

		beforeEach(inject(function($rootScope, $controller, _$sce_, _$route_, _$location_, _$mdSidenav_, _blogPostsService_, _firebaseService_, _soundcloudService_) {
			scope = $rootScope.$new();
			sce = _$sce_;
			route = _$route_;
			loc = _$location_;
			sidenav = _$mdSidenav_;
			blogPostsService = _blogPostsService_;
			spyOn(blogPostsService,'query').and.callFake(function() { return []; });
			firebaseService = _firebaseService_;
			soundcloudService = _soundcloudService_;
			ctrl = $controller('blogCtrl', { $scope: scope, $sce: sce, $route: route, $location: loc, $mdSidenav: sidenav, blogPostsService: blogPostsService, firebaseService: firebaseService, soundcloudService: soundcloudService });
		}));

		it('should be defined', function() {
			expect(ctrl).toBeDefined();
		});

		it('should have variables and methods defined', function() {
			expect(scope.inputReleaseCode).toBeUndefined();
			expect(scope.blogPosts).toEqual(jasmine.any(Array));
			expect(scope.blogPosts.length).toEqual(0);
			expect(scope.selectedBlogPostId).toEqual(0);
			expect(scope.selectedBlogPost).toEqual(jasmine.objectContaining({}));
			expect(scope.disableBlogPostSelector).toEqual(jasmine.any(Function));
			expect(scope.returnWidgetLink).toEqual(jasmine.any(Function));
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

	describe('addBlogPostDialogCtrl', function() {
		var scope, ctrl, dialog, timeout, regXpatternsService, addBlogPostService;

		beforeEach(inject(function($rootScope, $controller, _$mdDialog_, _$timeout_, _regXpatternsService_, _addBlogPostService_) {
			scope = $rootScope.$new();
			dialog = _$mdDialog_;
			timeout = _$timeout_;
			regXpatternsService = _regXpatternsService_;
			addBlogPostService = _addBlogPostService_;
			spyOn(addBlogPostService,'query').and.callFake(function() { return []; });
			ctrl = $controller('addBlogPostDialogCtrl', { $scope: scope, $mdDialog: dialog, $timeout: timeout, regXpatternsService: regXpatternsService, addBlogPostService: addBlogPostService });
		}));

		it('should be defined', function() {
			expect(ctrl).toBeDefined();
		});

		it('should have variables and methods defined', function() {
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

	describe('contactCtrl', function() {
		var scope, ctrl, timeout, regXpatternsService, submitFormService;

		beforeEach(inject(function($rootScope, $controller, _$timeout_, _regXpatternsService_, _submitFormService_) {
			scope = $rootScope.$new();
			timeout = _$timeout_;
			regXpatternsService = _regXpatternsService_;
			submitFormService = _submitFormService_;
			spyOn(submitFormService,'query').and.callFake(function() { return []; });
			ctrl = $controller('contactCtrl', { $scope: scope, $timeout: timeout, regXpatternsService: regXpatternsService, submitFormService: submitFormService });
		}));

		it('should be defined', function() {
			expect(ctrl).toBeDefined();
		});

		it('should have variables and methods defined', function() {
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

	describe('aboutCtrl', function() {
		var scope, ctrl, route, dnbhubDetailsService, firebaseService;

		beforeEach(inject(function($rootScope, $controller, _$route_, _dnbhubDetailsService_, _firebaseService_) {
			scope = $rootScope.$new();
			route = _$route_;
			dnbhubDetailsService = _dnbhubDetailsService_;
			spyOn(dnbhubDetailsService,'query').and.callFake(function() { return []; });
			firebaseService = _firebaseService_;
			ctrl = $controller('aboutCtrl', { $scope: scope, $route: route, dnbhubDetailsService: dnbhubDetailsService, firebaseService: firebaseService });
		}));

		it('should be defined', function() {
			expect(ctrl).toBeDefined();
		});

		it('should have variables and methods defined', function() {
			expect(scope.dnbhubDetails).toEqual(jasmine.objectContaining({}));
			expect(scope.firebase).toEqual(firebaseService);
			expect(scope.updateDnbhubDetails).toEqual(jasmine.any(Function));
		});

	});

});
