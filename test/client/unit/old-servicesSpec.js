/* global inject, expect */

/*
*	dynamically set backend base url to be able to deploy on any domain
*/
function setBaseUrl(absUrl) {
	return absUrl.match(new RegExp('http(s)?:\/\/[^/]+'))[0];
}

var SC = { // SC mock
	initialize: (options) => true
};

beforeEach(module('dnbhubServices', 'ngResource', 'ngRoute'));

describe('Dnbhub services', () => {
	let service, q, location, route, win, loc;

	describe('sendEmailService', () => {
		beforeEach(inject((sendEmailService, $location, $httpBackend) => {
			service = sendEmailService;
			location = $location;
			httpBackend = $httpBackend;
		}));
		it('must be defined', () => {
			expect(service).toBeDefined();
		});
	});

	describe('addBlogPostService', () => {
		beforeEach(inject((addBlogPostService, $location, $httpBackend) => {
			service = addBlogPostService;
			location = $location;
			httpBackend = $httpBackend;
		}));
		it('must be defined', () => {
			expect(service).toBeDefined();
		});
	});

	describe('soundcloudService', () => {
		beforeEach(inject((soundcloudService) => {
			service = soundcloudService;
		}));
		it('must be defined', () => {
			expect(service).toBeDefined();
		});
		it('must have variables and methods definitions', () => {
			expect(service.init).toEqual(jasmine.any(Function));
			expect(service.getLinkWithId).toEqual(jasmine.any(Function));
			expect(service.widgetLink).toEqual(jasmine.objectContaining({
				playlist: jasmine.any(Function),
				track: jasmine.any(Function)
			}));
		});
		it('must have call SC.initialize method with given options on the init mehod call', () => {
			spyOn(SC, 'initialize').and.callThrough();
			service.init();
			expect(SC.initialize).toHaveBeenCalledWith({
				client_id: jasmine.any(String),
				redirect_uri: 'http://dnbhub.com/callback.html'
			});
		});
	});

	describe('firebaseService', () => {
		beforeEach(inject(($rootScope, _$q_, _$route_, _$window_, _$location_, firebaseService) => {
			scope = $rootScope.$new();
			q = _$q_;
			route = _$route_;
			win = _$window_;
			loc = _$location_;
			service = firebaseService;
		}));
		it('must be defined', () => {
			expect(service).toBeDefined();
		});
		it('must have variables and methods definitions', () => {
			expect(service.initFirebase).toEqual(jasmine.any(Function));
			expect(service.hasOwnProperty('db')).toBeTruthy();
			expect(service.db).toBeUndefined();
			expect(service.hasOwnProperty('auth')).toBeTruthy();
			expect(service.auth).toBeUndefined();
			expect(service.hasOwnProperty('user')).toBeTruthy();
			expect(service.user).toBeUndefined();
			expect(service.isSignedIn).toEqual(jasmine.any(Boolean));
			expect(service.isSignedIn).toBeFalsy();
			expect(service.getDB).toEqual(jasmine.any(Function));
			expect(service.authErrorCheck).toEqual(jasmine.any(Function));
			expect(service.checkDBuserUID).toEqual(jasmine.any(Function));
			expect(service.setDBuserNewValues).toEqual(jasmine.any(Function));
			expect(service.authenticate).toEqual(jasmine.any(Function));
			expect(service.signout).toEqual(jasmine.any(Function));
			expect(service.create).toEqual(jasmine.any(Function));
			expect(service.delete).toEqual(jasmine.any(Function));
		});
	});
});
