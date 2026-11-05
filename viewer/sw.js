/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * The installed viewer's service worker: what lets it open with no connection. The build writes it to the site as
 * sw.js (vite.viewer.config.ts), filling in the two lists below. It keeps the viewer's own files only:
 *
 *   the shell        the page, its script and style, the manifest, the icons and the scenery's thumbnails, all kept
 *                    when this version installs, and dropped with it when a newer one takes over;
 *   the panoramas    environments/*.jpg, kept as the walkthrough first shows each one.
 *
 * The page comes from the network first, so a new version shows as soon as it is published; this device's copy is
 * for when there is no connection. Google's sign-in and Drive are left alone: the page keeps Drive's answers itself
 * (kept.ts), and data/ (a look on this computer before publishing) is never kept.
 */

/* The build fills these in. */
const VERSION = '0cb4c31396f49a3b';
const SHELL = ["apple-touch-icon.png","assets/viewer-A1egEgI2.js","assets/viewer-lq3oyFVu.css","environments/autumn_hilly_field-thumb.jpg","environments/canary_wharf-thumb.jpg","environments/charolettenbrunn_park-thumb.jpg","environments/german_town_street-thumb.jpg","environments/quattro_canti-thumb.jpg","environments/simons_town_harbour-thumb.jpg","environments/spree_bank-thumb.jpg","environments/stuttgart_suburbs-thumb.jpg","environments/urban_courtyard_02-thumb.jpg","environments/urban_street_01-thumb.jpg","icon-192.png","icon-512.png","icon.svg","index.html","manifest.webmanifest","maskable-512.png"];
const SCENERY_VERSION = '45cfc5224148038a';

const SHELL_CACHE = `blok-ai-viewer-shell-${VERSION}`;
const SCENERY_CACHE = `blok-ai-viewer-scenery-${SCENERY_VERSION}`;
const OURS = /^blok-ai-viewer-(shell|scenery)-/;
// How long the page waits for the network before it opens from this device: a weak signal is no signal.
const PATIENCE = 4000;

const scope = () => new URL(self.registration.scope);
const inScope = (file) => new URL(file, self.registration.scope).href;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL.map(inScope)))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((name) => OURS.test(name) && name !== SHELL_CACHE && name !== SCENERY_CACHE).map((name) => caches.delete(name))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const base = scope();
  if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) return;
  const path = url.pathname.slice(base.pathname.length);
  if (path.startsWith('data/')) return;
  if (request.mode === 'navigate') event.respondWith(page(request));
  else if (/^environments\/[^/]+\.jpg$/i.test(path) && !SHELL.includes(path)) event.respondWith(panorama(request));
  else event.respondWith(shell(request));
});

/** The page: the network's when it answers in time, else the one this version keeps. */
async function page(request) {
  const network = fetch(request);
  network.catch(() => {}); // a failure after the wait is no one's to see
  const late = new Promise((resolve) => setTimeout(resolve, PATIENCE, null));
  try {
    const answer = await Promise.race([network, late]);
    if (answer) return answer;
  } catch {
    /* no connection */
  }
  const kept = await caches.match(inScope('index.html'), {cacheName: SHELL_CACHE});
  return kept ?? network;
}

/** The page's own files: as this version keeps them, else from the network. */
async function shell(request) {
  const kept = await caches.match(request, {cacheName: SHELL_CACHE, ignoreSearch: true});
  return kept ?? fetch(request);
}

/** A panorama: kept once it is shown, the same file each time after. */
async function panorama(request) {
  const cache = await caches.open(SCENERY_CACHE);
  const kept = await cache.match(request, {ignoreSearch: true});
  if (kept) return kept;
  const answer = await fetch(request);
  if (answer.ok) await cache.put(request, answer.clone()).catch(() => {});
  return answer;
}
