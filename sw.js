// Service Worker for Nomik.ai Marketing Website
// Handles caching, offline functionality, and form submissions

const CACHE_NAME = 'nomik-v1.0.0';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/nomik-design-system.css',
  '/nomik-theme.js',
  '/favicon.svg'
];

// Install event - cache static assets
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(function() {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', function(event) {
  // Handle form submissions
  if (event.request.url.includes('/api/forms') && event.request.method === 'POST') {
    event.respondWith(handleFormSubmission(event.request));
    return;
  }

  // Handle static assets
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(function() {
        // Offline fallback
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});

// Handle form submissions with mock backend
async function handleFormSubmission(request) {
  try {
    const formData = await request.formData();
    const formType = request.headers.get('X-Form-Type') || 'contact';

    // Mock form processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Validate required fields
    const email = formData.get('email');
    const company = formData.get('company');

    if (!email || !company) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Mock successful submission
    const submissionId = 'sub_' + Math.random().toString(36).substr(2, 9);

    // Log to analytics (in a real app, this would go to your backend)
    self.registration.sync.register('form-submission');

    return new Response(JSON.stringify({
      success: true,
      submissionId: submissionId,
      message: 'Thank you! We\'ll be in touch within 24 hours.',
      formType: formType
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Submission failed. Please try again.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Background sync for offline form submissions
self.addEventListener('sync', function(event) {
  if (event.tag === 'form-submission') {
    event.waitUntil(processOfflineSubmissions());
  }
});

async function processOfflineSubmissions() {
  // Process any queued form submissions when back online
  // Process offline form submissions
}

// Push notification handling (for future use)
self.addEventListener('push', function(event) {
  const options = {
    body: event.data ? event.data.text() : 'New update from Nomik',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: 'nomik-notification'
  };

  event.waitUntil(
    self.registration.showNotification('Nomik.ai', options)
  );
});

// Analytics tracking
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'TRACK_EVENT') {
    // Track events in service worker
    trackAnalyticsEvent(event.data);
  }
});

function trackAnalyticsEvent(eventData) {
  // Queue analytics events for batch sending
  // In production, this would integrate with your analytics service
  // Track analytics event
}