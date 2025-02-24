/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope

const CACHE_NAME = "portfolio-cache-v1"

// Assets to cache
const STATIC_ASSETS = ["/", "/offline", "/manifest.json", "/icon-192x192.png", "/icon-512x512.png"]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    }),
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)))
    }),
  )
})

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match("/offline")
      }),
    )
    return
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).then((fetchResponse) => {
          if (fetchResponse.status === 200 && event.request.url.startsWith(self.location.origin)) {
            const responseToCache = fetchResponse.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache)
            })
          }
          return fetchResponse
        })
      )
    }),
  )
})

self.addEventListener("push", (event) => {
  const data = event.data?.json()

  if (data) {
    const options = {
      body: data.body,
      icon: "/icon-192x192.png",
      badge: "/icon-192x192.png",
      data: {
        url: data.url,
      },
    }

    event.waitUntil(self.registration.showNotification(data.title, options))
  }
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.notification.data?.url) {
    event.waitUntil(clients.openWindow(event.notification.data.url))
  }
})

