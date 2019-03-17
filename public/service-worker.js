/**
 * @name getCacheName
 * @member {Function}
 * @summary Gets cache name.
 * @description Gets build hash.
 * @returns {Promise}
 */
function getCacheName() {
  return new Promise(function(resolve) {
    fetch(self.registration.scope + 'hashsum.json').then(async function(response) {
      var json = await response.json();
      resolve('dnbhub-' + json.hashsum);
    }).catch(function() {
      resolve('NA-' + new Date().getTime());
    });
  });
}

/**
 * @name cacheName
 * @summary Cache name.
 * @description Cache name in format: tn-webapp-HASHSUM or NA-CURRENTTIME.
 */
var cacheName;

/**
 * @name staticAssets
 * @summary Cached static assets.
 */
var staticAssets = [
  '/public/index.html',
  '/public/app/views/app.html',
  '/public/app/views/app-nav.html',
  '/public/app/views/app-index.html',
  '/public/app/views/app-about.html',
  '/public/app/views/app-admin.html',
  '/public/app/views/app-blog.html',
  '/public/app/views/app-contact.html',
  '/public/app/views/app-freedownloads.html',
  '/public/app/views/app-reposts.html',
  '/public/app/views/app-singles.html',
  '/public/app/views/app-user.html',
  '/public/app/views/soundcloud-player.html',
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
  '/public/img/svg/*.svg',
  '/public/img/*.png',
  '/favicon.ico'
];

/**
 * @name updateCache
 * @member {Function}
 * @summary Updates cache.
 * @description Deletes caches with keys matching a specific pattern.
 * @returns {Promise}
 */
function updateCache() {
  return new Promise(function(resolve) {
    getCacheName().then(function(gotCacheName) {
      console.log('SW, updateCache: compare hashes, cacheName', cacheName, '| gotCacheName', gotCacheName);
      if (cacheName !== gotCacheName) {
        cacheName = gotCacheName;
        console.log('SW, updateCache, updating cache, cacheName', cacheName);

        clearCache().then(function() {
          caches.open(cacheName).then(function(cache) {
            cache.addAll(staticAssets).then(function() {
              console.log('SW, updated cached static assets');
              resolve();
            });
          });
        });
      } else {
        console.log('SW, updateCache: not need, hashes are the same');
        resolve();
      }
    });
  });
}

/**
 * @name clearCache
 * @member {Function}
 * @summary Clears cache.
 * @description Deletes all caches with name different from current cache name.
 * @returns {Promise}
 */
function clearCache() {
  return caches.keys().then(function(keys) {
    console.log('SW, clearCache: caches', caches);
    keys.forEach(function(key) {
      if (key !== cacheName) {
        caches.delete(key);
      }
    });
  });
}

/**
 * Service worker install event listener.
 */
self.addEventListener('install', function(event) {
  console.log('SW, install event', event);
  event.waitUntil(
    updateCache()
  );
});

/**
 * Service worker activate event listener.
 */
self.addEventListener('activate', function(event) {
  console.log('SW, activate event', event);
});

/**
 * Service worker fetch event listener.
 */
self.addEventListener('fetch', function(event) {
  var request = event.request;
  event.respondWith(caches.open(cacheName).then(function(cache) {
    return cache.match(request).then(function(response) {
      if (response) {
        // console.log('SW, returns cached respose on request', request);
        return response;
      } else {
        return fetch(request);
      }
    }).catch(function(error) {
      return error;
    });
  }));
});
