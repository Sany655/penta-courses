import os

os.makedirs('src/lib', exist_ok=True)

analytics_code = """// Privacy-Conscious Client Analytics Dispatcher
// Note: Never dispatches sensitive answers, clinical data, or private user credentials.

export function trackEvent(eventName, properties = {}) {
  try {
    const payload = {
      event: eventName,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.pathname : '',
      properties: {
        ...properties,
        // Strip any potential sensitive inputs
        answer: undefined,
        solution: undefined,
        password: undefined,
        token: undefined
      }
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics Event]', eventName, payload);
    }

    // If Google Analytics / Plausible / Custom endpoint configured:
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push(payload);
    }
  } catch (err) {
    console.warn('[Analytics Error]', err);
  }
}
"""

with open('src/lib/analytics.js', 'w', encoding='utf-8') as f:
    f.write(analytics_code)

print('Created src/lib/analytics.js!')
