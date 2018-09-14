var version = '1.1';
var cacheName = 'ikTel' + version;
var filesToCache = [
  '/ikTel/',
  '/ikTel/index.html',
  '/ikTel/script.js',
  '/ikTel/style.css',
  '/ikTel/audio/Siri/1.mp3',
  '/ikTel/audio/Siri/2.mp3',
  '/ikTel/audio/Siri/3.mp3',
  '/ikTel/audio/Siri/4.mp3',
  '/ikTel/audio/Siri/5.mp3',
  '/ikTel/audio/Siri/6.mp3',
  '/ikTel/audio/Siri/7.mp3',
  '/ikTel/audio/Siri/8.mp3',
  '/ikTel/audio/Siri/9.mp3',
  '/ikTel/audio/Siri/10.mp3',
  '/ikTel/audio/Siri/11.mp3',
  '/ikTel/audio/Siri/12.mp3',
  '/ikTel/audio/Siri/13.mp3',
  '/ikTel/audio/Siri/14.mp3',
  '/ikTel/audio/Siri/20.mp3',
  '/ikTel/audio/Siri/en20.mp3',
  '/ikTel/audio/Siri/30.mp3',
  '/ikTel/audio/Siri/en30.mp3',
  '/ikTel/audio/Siri/40.mp3',
  '/ikTel/audio/Siri/en40.mp3',
  '/ikTel/audio/Siri/50.mp3',
  '/ikTel/audio/Siri/en50.mp3',
  '/ikTel/audio/Siri/60.mp3',
  '/ikTel/audio/Siri/en60.mp3',
  '/ikTel/audio/Siri/70.mp3',
  '/ikTel/audio/Siri/en70.mp3',
  '/ikTel/audio/Siri/80.mp3',
  '/ikTel/audio/Siri/en80.mp3',
  '/ikTel/audio/Siri/90.mp3',
  '/ikTel/audio/Siri/en90.mp3',
  '/ikTel/audio/Siri/start.mp3',
  '/ikTel/audio/NielsVanBelle/1.mp3',
  '/ikTel/audio/NielsVanBelle/2.mp3',
  '/ikTel/audio/NielsVanBelle/3.mp3',
  '/ikTel/audio/NielsVanBelle/4.mp3',
  '/ikTel/audio/NielsVanBelle/5.mp3',
  '/ikTel/audio/NielsVanBelle/6.mp3',
  '/ikTel/audio/NielsVanBelle/7.mp3',
  '/ikTel/audio/NielsVanBelle/8.mp3',
  '/ikTel/audio/NielsVanBelle/9.mp3',
  '/ikTel/audio/NielsVanBelle/10.mp3',
  '/ikTel/audio/NielsVanBelle/11.mp3',
  '/ikTel/audio/NielsVanBelle/12.mp3',
  '/ikTel/audio/NielsVanBelle/13.mp3',
  '/ikTel/audio/NielsVanBelle/14.mp3',
  '/ikTel/audio/NielsVanBelle/20.mp3',
  '/ikTel/audio/NielsVanBelle/en20.mp3',
  '/ikTel/audio/NielsVanBelle/30.mp3',
  '/ikTel/audio/NielsVanBelle/en30.mp3',
  '/ikTel/audio/NielsVanBelle/40.mp3',
  '/ikTel/audio/NielsVanBelle/en40.mp3',
  '/ikTel/audio/NielsVanBelle/50.mp3',
  '/ikTel/audio/NielsVanBelle/en50.mp3',
  '/ikTel/audio/NielsVanBelle/60.mp3',
  '/ikTel/audio/NielsVanBelle/en60.mp3',
  '/ikTel/audio/NielsVanBelle/70.mp3',
  '/ikTel/audio/NielsVanBelle/en70.mp3',
  '/ikTel/audio/NielsVanBelle/80.mp3',
  '/ikTel/audio/NielsVanBelle/en80.mp3',
  '/ikTel/audio/NielsVanBelle/90.mp3',
  '/ikTel/audio/NielsVanBelle/en90.mp3',
  '/ikTel/audio/NielsVanBelle/start.mp3'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
