// public/service-worker.js

const CACHE_NAME = 'trip-logs-cache-v1';
const APP_SHELL_URLS = [
    '/', // Cache the root page
    '/trips', // Cache the trips page
    '/summary', // Cache the summary page
    '/history', // Cache the history page
    '/settings', // Cache the settings page
    // Add other essential static assets here
    '/globals.css',
    '/manifest.json',
    '/icon.png',
    // You might need to dynamically cache Next.js build assets
    // This is a basic example and might need adjustments based on your Next.js build output
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching app shell');
                return cache.addAll(APP_SHELL_URLS);
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    // Handle navigation requests
    if (event.request.mode === 'navigate') {
        event.respondWith(
            caches.match(event.request).then((response) => {
                if (response) {
                    console.log('Service Worker: Serving from cache for navigation', event.request.url);
                    return response;
                }
                console.log('Service Worker: Fetching from network for navigation', event.request.url);
                return fetch(event.request);
            })
            .catch(() => {
                // If network fails and no cache match, serve a fallback page
                // You might want to create an offline.html page
                // return caches.match('/offline.html');
                 console.error('Service Worker: Fetch failed and no cache match', event.request.url);
                 return new Response('<h1>Offline</h1>', { headers: { 'Content-Type': 'text/html' } });
            })
        );
        return;
    }

    // For other requests (assets, etc.), try cache first, then network
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                console.log('Service Worker: Serving from cache', event.request.url);
                return response;
            }
            console.log('Service Worker: Fetching from network', event.request.url);
            return fetch(event.request).catch(() => {
                // Handle offline for other requests if needed
                // e.g., return a placeholder image for images
            });
        })
    );
});