const CACHE_NAME="ai-command-center-v4";
const APP_SHELL=["./","./index.html","./style.css","./gemini-native.css","./script.js","./manifest.json","./icons/icon.svg"];

self.addEventListener("install",e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_SHELL)));
});

self.addEventListener("activate",e=>{
  e.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;

  const url=new URL(e.request.url);
  const isAppAsset=APP_SHELL.some(asset=>url.pathname.endsWith(asset.replace("./","")))||url.pathname.endsWith("/");

  if(isAppAsset){
    e.respondWith(
      fetch(e.request,{cache:"no-store"})
        .then(response=>{
          const copy=response.clone();
          caches.open(CACHE_NAME).then(cache=>cache.put(e.request,copy));
          return response;
        })
        .catch(()=>caches.match(e.request))
    );
    return;
  }

  e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request)));
});
