const CACHE='hifz-v3';
const STATIC=['./','./index.html','./manifest.json','./icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(STATIC)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const u=e.request.url;
  if(u.includes('fonts.googleapis')||u.includes('fonts.gstatic')||u.includes('cdnjs')){
    e.respondWith(caches.open(CACHE).then(c=>c.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{c.put(e.request,r.clone());return r;}))));
    return;
  }
  if(u.includes('alquran.cloud')){
    e.respondWith(caches.open(CACHE).then(c=>c.match(e.request).then(cached=>{
      if(cached)return cached;
      return fetch(e.request).then(r=>{if(r.ok)c.put(e.request,r.clone());return r;}).catch(()=>cached||new Response('{}',{status:503}));
    })));
    return;
  }
  e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
});
