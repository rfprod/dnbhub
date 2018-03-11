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
	let service, httpBackend, q, route, win, loc;

	describe('freedownloadsService', () => {
		beforeEach(inject((freedownloadsService, $httpBackend) => {
			service = freedownloadsService;
			httpBackend = $httpBackend;
		}));
		it('must be defined', () => {
			expect(service).toBeDefined();
		});
		it('must have a query mehod which returns a promise - an array of objects', () => {
			httpBackend.expectGET(new RegExp(/\/data\/freedownloads-data\.json$/)).respond([
				{
					'title': 'item 1',
					'iframeLink': 'https://www.toneden.io/dnbhub/post/mc-kryptomedic-feat-midas-another-day-shwarz-remix?embed=true'
				},
				{
					'title': 'item 2',
					'iframeLink': 'https://www.toneden.io/dnbhub/post/alerstorm-hook-shwarz-remix?embed=true'
				}
			]);
			expect(service.query).toBeDefined();
			const response = service.query();
			httpBackend.flush();
			expect(response).toBeDefined();
			expect(response.length).toBeGreaterThan(0);
			for (let i = 0, max = response.length - 1; i < max; i++) {
				expect(response[i].title).toBeDefined();
				expect(response[i].iframeLink).toBeDefined();
			}
		});
	});
	
	describe('blogPostsService', () => {
		beforeEach(inject((blogPostsService, $httpBackend) => {
			service = blogPostsService;
			httpBackend = $httpBackend;
		}));
		it('must be defined', () => {
			expect(service).toBeDefined();
		});
		it('must have a query method which returns a promise - an array of objects', () => {
			httpBackend.expectGET(new RegExp(/\/data\/blog-posts\.json$/)).respond([
				{
					"code": "BNKR002",
					"title": "War - Invisible EP - BNKR002",
					"logo": "img/logos/MethLab-logo-200p.jpg",
					"links": {
						"website": "http://methlab-agency.com/",
						"soundcloud": "https://soundcloud.com/methlab-recordings",
						"twitter": "https://twitter.com/MethlabAgency",
						"facebook": "https://www.facebook.com/methlabagency",
						"youtube": "https://www.youtube.com/channel/UCT8WoPhozELIF2uuFy7JNSQ",
						"instagram": "",
						"bandcamp": ""
					},
					"soundcloudUserId": 6118906,
					"widgetLink": "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/239353102&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true",
					"text": "<p>BNKR002 - War - Invisible EP // Invisible.</p><p>MethLab Recordings.</p><p><strong>Release Date:</strong> 05.08.2016</p>"
				},
				{
					"code": "BNKR002",
					"title": "War - Invisible EP - BNKR002",
					"logo": "img/logos/MethLab-logo-200p.jpg",
					"links": {
						"website": "http://methlab-agency.com/",
						"soundcloud": "https://soundcloud.com/methlab-recordings",
						"twitter": "https://twitter.com/MethlabAgency",
						"facebook": "https://www.facebook.com/methlabagency",
						"youtube": "https://www.youtube.com/channel/UCT8WoPhozELIF2uuFy7JNSQ",
						"instagram": "",
						"bandcamp": ""
					},
					"soundcloudUserId": 6118906,
					"widgetLink": "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/239353102&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true",
					"text": "<p>BNKR002 - War - Invisible EP // Invisible.</p><p>MethLab Recordings.</p><p><strong>Release Date:</strong> 05.08.2016</p>"
				}
			]);
			expect(service.query).toBeDefined();
			const response = service.query();
			httpBackend.flush();
			expect(response).toBeDefined();
			expect(response.length).toBeGreaterThan(0);
			for (let i = 0, max = response.length - 1; i < max; i++) {
				expect(response[i].code).toBeDefined();
				expect(response[i].title).toBeDefined();
				expect(response[i].logo).toBeDefined();
				expect(response[i].links).toBeDefined();
				expect(response[i].links.website).toBeDefined();
				expect(response[i].links.soundcloud).toBeDefined();
				expect(response[i].links.twitter).toBeDefined();
				expect(response[i].links.facebook).toBeDefined();
				expect(response[i].links.youtube).toBeDefined();
				expect(response[i].links.instagram).toBeDefined();
				expect(response[i].links.bandcamp).toBeDefined();
				expect(response[i].soundcloudUserId).toBeDefined();
				expect(response[i].widgetLink).toBeDefined();
				expect(response[i].text).toBeDefined();
			}
		});
	});

	describe('dnbhubDetailsService', () => {
		beforeEach(inject((dnbhubDetailsService, $httpBackend) => {
			service = dnbhubDetailsService;
			httpBackend = $httpBackend;
		}));
		it('must be defined', () => {
			expect(service).toBeDefined();
		});
		it('must have a query mehod which returns a promise - an object', () => {
			httpBackend.expectGET(new RegExp(/\/data\/dnbhub-details\.json$/)).respond({
				"title": "Drum and Bass Hub",
				"links": {
					"soundcloud": "https://soundcloud.com/dnbhub",
					"rss": "http://feeds.soundcloud.com/users/soundcloud:users:1275637/sounds.rss",
					"twitter": "https://twitter.com/dnbhub_com",
					"facebook": "http://facebook.com/dnbhub",
					"youtube": "https://www.youtube.com/c/DrumnBassHubCentral",
					"instagram": "https://www.instagram.com/dnbhub/",
					"bandcamp": "http://dnbhub.bandcamp.com/"
				},
				"poweredBy": [
					{
						"name":"Twiter",
						"logo":"img/svg/TwitterBird_logo.svg"
					},
					{
						"name":"Soundcloud",
						"logo":"img/svg/SoundCloud_logo.svg"
					},
					{
						"name":"AngularJS",
						"logo":"img/svg/AngularJS_logo.svg"
					},
					{
						"name":"Mailchimp",
						"logo":"img/svg/MailChimp_logo.svg"
					}
				],
				"soundcloudUserId": 1275637,
				"widgetLink": "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/225838848&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true",
				"text": "<p><strong>Dnbhub</strong> is a multimedia resource, which main function is semi-automatic data aggregation and presentation upon a user request.</p><p><strong>Mission</strong> - as it follows from the title, this multimedia concentrator is dedicated to Drum'n'Bass (also written as Drum & Bass, Drum&Bass, Drum and Bass, DnB, D&B, D'n'B) and its subgenres.</p><p><strong>Structure</strong> - Dnbhub has the following sections: INDEX, SINGLES, FREE DOWNLOADS, FEATURED, BLOG, CONTACT, ABOUT.</p><p><strong>What is it to you:</strong><ul><li>if you are a <strong>listener</strong> take time to explore Dnbhub, you may discover interesting artists and some free stuff from them;</li><li>if you are a <strong>producer</strong>, a <strong>DJ</strong>, an <strong>MC</strong>, or a <strong>manager</strong> somehow involved in worldwide Drum'n'Bass scene activities you can get in touch with us either on social networks or by using a contact form on this website to negotiate ways we can help you expose your works in a more efficient way.</li></ul></p><p><strong>Revision Date:</strong> 10.07.2016</p>"
			});
			expect(service.query).toBeDefined();
			const response = service.query();
			httpBackend.flush();
			expect(response).toBeDefined();
			expect(response.title).toBeDefined();
			expect(response.links.soundcloud).toBeDefined();
			expect(response.links.rss).toBeDefined();
			expect(response.links.twitter).toBeDefined();
			expect(response.links.facebook).toBeDefined();
			expect(response.links.youtube).toBeDefined();
			expect(response.links.instagram).toBeDefined();
			expect(response.links.bandcamp).toBeDefined();
			expect(response.poweredBy).toBeDefined();
			expect(response.poweredBy.length).toEqual(4);
			for (let i = 0, max = response.poweredBy.length - 1; i < max; i++) {
				expect(response.poweredBy[i].name).toBeDefined();
				expect(response.poweredBy[i].logo).toBeDefined();
			}
			expect(response.soundcloudUserId).toBeDefined();
			expect(response.widgetLink).toBeDefined();
			expect(response.text).toBeDefined();
		});
	});

	/*
	*	TODO:spec submitFormService
	*/

	/*
	*	TODO:spec addBlogPostService
	*/

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
