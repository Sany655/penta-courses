'use client';

import React from 'react';

export default function RefundPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 text-sm text-slate-300 space-y-6 leading-relaxed">
        <h1 className="text-3xl font-extrabold text-slate-100 mb-6">Refund Policy</h1>
        <p>
          We want you to be completely satisfied with your learning experience on PentaCourse.
        </p>
        <h2 className="text-base font-bold text-slate-100">1. Course Track Purchases</h2>
        <p>
          We offer a full <strong>7-day money-back guarantee</strong> for any individual Course Track purchase, provided that less than 30% of the course modules have been completed and no certificate has been generated.
        </p>
        <h2 className="text-base font-bold text-slate-100">2. Pro Subscriptions</h2>
        <p>
          You may cancel your monthly Pro subscription at any time through your learner account settings. Cancellation will take effect at the conclusion of the current billing cycle.
        </p>
        <h2 className="text-base font-bold text-slate-100">3. Module Bypasses</h2>
        <p>
          Instant module bypass purchases are consumed immediately upon unlock and are non-refundable once the downstream module access is granted.
        </p>
    </main>
  );
}
