var version = '1.1';
var cacheName = 'ikTel' + version;
var filesToCache = [
  '/',
  '/index.html',
  '/script.js',
  '/style.css',
  '/audio/Siri/1.mp3',
  '/audio/Siri/2.mp3',
  '/audio/Siri/3.mp3',
  '/audio/Siri/4.mp3',
  '/audio/Siri/5.mp3',
  '/audio/Siri/6.mp3',
  '/audio/Siri/7.mp3',
  '/audio/Siri/8.mp3',
  '/audio/Siri/9.mp3',
  '/audio/Siri/10.mp3',
  '/audio/Siri/11.mp3',
  '/audio/Siri/12.mp3',
  '/audio/Siri/13.mp3',
  '/audio/Siri/14.mp3',
  '/audio/Siri/20.mp3',
  '/audio/Siri/en20.mp3',
  '/audio/Siri/30.mp3',
  '/audio/Siri/en30.mp3',
  '/audio/Siri/40.mp3',
  '/audio/Siri/en40.mp3',
  '/audio/Siri/50.mp3',
  '/audio/Siri/en50.mp3',
  '/audio/Siri/60.mp3',
  '/audio/Siri/en60.mp3',
  '/audio/Siri/70.mp3',
  '/audio/Siri/en70.mp3',
  '/audio/Siri/80.mp3',
  '/audio/Siri/en80.mp3',
  '/audio/Siri/90.mp3',
  '/audio/Siri/en90.mp3',
  '/audio/Siri/start.mp3',
  '/audio/NielsVanBelle/1.mp3',
  '/audio/NielsVanBelle/2.mp3',
  '/audio/NielsVanBelle/3.mp3',
  '/audio/NielsVanBelle/4.mp3',
  '/audio/NielsVanBelle/5.mp3',
  '/audio/NielsVanBelle/6.mp3',
  '/audio/NielsVanBelle/7.mp3',
  '/audio/NielsVanBelle/8.mp3',
  '/audio/NielsVanBelle/9.mp3',
  '/audio/NielsVanBelle/10.mp3',
  '/audio/NielsVanBelle/11.mp3',
  '/audio/NielsVanBelle/12.mp3',
  '/audio/NielsVanBelle/13.mp3',
  '/audio/NielsVanBelle/14.mp3',
  '/audio/NielsVanBelle/20.mp3',
  '/audio/NielsVanBelle/en20.mp3',
  '/audio/NielsVanBelle/30.mp3',
  '/audio/NielsVanBelle/en30.mp3',
  '/audio/NielsVanBelle/40.mp3',
  '/audio/NielsVanBelle/en40.mp3',
  '/audio/NielsVanBelle/50.mp3',
  '/audio/NielsVanBelle/en50.mp3',
  '/audio/NielsVanBelle/60.mp3',
  '/audio/NielsVanBelle/en60.mp3',
  '/audio/NielsVanBelle/70.mp3',
  '/audio/NielsVanBelle/en70.mp3',
  '/audio/NielsVanBelle/80.mp3',
  '/audio/NielsVanBelle/en80.mp3',
  '/audio/NielsVanBelle/90.mp3',
  '/audio/NielsVanBelle/en90.mp3',
  '/audio/NielsVanBelle/start.mp3'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log("all cached");
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
