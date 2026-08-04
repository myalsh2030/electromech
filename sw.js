// عامل الخدمة: كاش كامل للعمل دون اتصال
const CACHE_VERSION = 'em-v2';

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/main.css',
  './icons.svg',
  './fonts/cairo-arabic.woff2',
  './fonts/cairo-latin.woff2',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './js/app.js',
  './js/store.js',
  './js/game.js',
  './js/ui.js',
  './js/quiz.js',
  './js/personalize.js',
  './js/simhost.js',
  './js/recall.js',
  './js/screens/welcome.js',
  './js/screens/diag.js',
  './js/screens/home.js',
  './js/screens/unit.js',
  './js/screens/lesson.js',
  './js/screens/labs.js',
  './js/screens/glossary.js',
  './js/screens/me.js',
  './js/screens/review.js',
  './js/sims/simkit.js',
  './js/sims/labkit.js',
  './js/sims/registry.js',
  './js/sims/example.js',
  './js/sims/drawkit.js',
  './js/sims/sim-555-counter.js',
  './js/sims/sim-bjt-bench.js',
  './js/sims/sim-capacitor-rc.js',
  './js/sims/sim-control-panel.js',
  './js/sims/sim-diode-curve.js',
  './js/sims/sim-generator.js',
  './js/sims/sim-induction-motor.js',
  './js/sims/sim-magnetic-field.js',
  './js/sims/sim-ohm-power.js',
  './js/sims/sim-opamp-741.js',
  './js/sims/sim-oscilloscope.js',
  './js/sims/sim-rectifier.js',
  './js/sims/sim-series-parallel.js',
  './js/sims/sim-transformer.js',
  './data/course.js',
  './data/quizzes.js',
  './data/concepts.js',
  './data/predict.js',
  './data/glossary.js',
  './data/glossary-figs.js',
  './data/unit1.js',
  './data/unit2.js',
  './data/unit3.js',
  './data/unit4.js',
  './data/unit5.js',
  './data/unit6.js',
];

// تحديث ذري: skipWaiting بعد اكتمال التخزين كاملًا، والتطبيق يعيد التحميل
// مرة واحدة عند تغيّر المتحكم (controllerchange) — فلا تختلط نسختان أبدًا.
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_VERSION).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// شبكة أولًا للتنقل (لالتقاط التحديثات)، كاش أولًا للأصول
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;

  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then(c => c.put(e.request, copy));
          return res;
        })
        .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      if (res.ok) {
        const copy = res.clone();
        caches.open(CACHE_VERSION).then(c => c.put(e.request, copy));
      }
      return res;
    }))
  );
});
