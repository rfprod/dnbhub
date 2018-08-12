function getCacheName() {
	return new Promise(function(resolve/*, reject*/) {
		fetch(self.registration.scope + 'hashsum.json').then(async function(response) {
			var json = await response.json();
			resolve('dnbhub-' + json.hashsum);
		}).catch(function(/*error*/) {
			resolve('NA-' + new Date().getTime());
		});
	});
}
var cacheName;

var staticAssets = [
	'/public/index.html',
	'/public/app/views/*.html',
	'/public/js/vendor-pack.min.js',
	'/public/js/packed-app.min.js',
	'/public/css/vendor-pack.min.css',
	'/public/css/packed-app.min.css',
	'/public/webfonts/fa-brands-400.svg',
	'/public/webfonts/fa-brands-400.ttf',
	'/public/webfonts/fa-brands-400.eot',
	'/public/webfonts/fa-brands-400.woff',
	'/public/webfonts/fa-brands-400.woff2',
	'/public/webfonts/fa-regular-400.svg',
	'/public/webfonts/fa-regular-400.ttf',
	'/public/webfonts/fa-regular-400.eot',
	'/public/webfonts/fa-regular-400.woff',
	'/public/webfonts/fa-regular-400.woff2',
	'/public/webfonts/fa-solid-900.svg',
	'/public/webfonts/fa-solid-900.ttf',
	'/public/webfonts/fa-solid-900.eot',
	'/public/webfonts/fa-solid-900.woff',
	'/public/webfonts/fa-solid-900.woff2',
	'/public/webfonts/MaterialIcons-Regular.ttf',
	'/public/webfonts/MaterialIcons-Regular.eot',
	'/public/webfonts/MaterialIcons-Regular.woff',
	'/public/webfonts/MaterialIcons-Regular.woff2',
	'/public/img/body_bg.jpg',
	'/public/img/kosmos_circle.svg',
	'/public/img/kosmos_square.svg',
	'/favicon.ico'
];

self.addEventListener('install', function(event) {
	console.log('>> serviceWorker, install event', event);
	/*
	* use caching
	*/
	event.waitUntil(
		getCacheName().then(function(gotCacheName) {
			cacheName = gotCacheName;
			console.log('>> SERVICE WORKER, cacheName:', cacheName);

			event.waitUntil(updateCache());
		})
	);
});

self.addEventListener('activate', function(event) {
	console.log('>> serviceWorker, activated event', event);
	event.waitUntil(
		caches.keys().then(function(keys) {
			console.log('caches keys', keys);
			keys.forEach(function(cacheKey) {
				if (cacheKey !== cacheName) {
					caches.delete(cacheKey);
				}
			});
		})
	);
});

function updateCache() {
	return new Promise(function(resolve) {
		getCacheName().then(function(gotCacheName) {
			console.log('updateCache, compare build hashes');
			if (cacheName !== gotCacheName) {
				cacheName = gotCacheName;
				console.log('updateCache, updating cache, cacheName', cacheName);

				caches.keys().then(function(keys) {
					keys.forEach(function(cacheKey) {
						if (cacheKey !== cacheName) {
							caches.delete(cacheKey);
						}
					});
				}).then(function() {
					caches.open(cacheName).then(function(cache) {
						cache.addAll(staticAssets).then(function() {
							console.log('>> serviceWorker, updated cached static assets');
							resolve();
						});
					});
				});
			} else {
				console.log('updateCache. not need to do that, build hashes are the same');
				resolve();
			}
		});
	});
}

self.addEventListener('fetch', function(event) {
	// console.log('>> serviceWorker, fetch event', event);
	var request = event.request;
	
	/*
	* Check cache, containing static assets, before fetching requests
	*/
	event.respondWith(caches.open(cacheName).then(function(cache) {
		return cache.match(request).then(function(response) {
			if (response) {
				// console.log('>> serviceWorker returns cached respose on request', request);
				return response;
			} else {
				return fetch(request);
			}
		}).catch(function(error) {
			return error;
		});
	}));
});
