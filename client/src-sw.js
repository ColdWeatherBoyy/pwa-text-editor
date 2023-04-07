const { offlineFallback, warmStrategyCache } = require("workbox-recipes");
const { CacheFirst } = require("workbox-strategies");
const { registerRoute } = require("workbox-routing");
const { CacheableResponsePlugin } = require("workbox-cacheable-response");
const { ExpirationPlugin } = require("workbox-expiration");
const { precacheAndRoute } = require("workbox-precaching/precacheAndRoute");

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
	cacheName: "page-cache",
	plugins: [
		new CacheableResponsePlugin({
			statuses: [0, 200],
		}),
		new ExpirationPlugin({
			maxAgeSeconds: 30 * 24 * 60 * 60,
		}),
	],
});

warmStrategyCache({
	urls: ["/index.html", "/"],
	strategy: pageCache,
});

registerRoute(({ request }) => request.mode === "navigate", pageCache);

// TODO: Implement asset caching
registerRoute(
	// Match requests whose destination is "style" or "script"
	({ request }) => request.destination === "style" || request.destination === "script",
	// CacheFirst strategy is picked
	new CacheFirst({
		// Give cache a name
		cacheName: "assets-cache",
		plugins: [
			// cache only responses with a status of 200
			new CacheableResponsePlugin({
				statuses: [0, 200],
			}),
		],
	})
);
