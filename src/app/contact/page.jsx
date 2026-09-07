'use client';

import React from 'react';

export default function ContactPage() {
  return (
    <main className="max-w-xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-extrabold text-slate-100 mb-4">Contact Support</h1>
        <p className="text-xs text-slate-400 mb-8">Have a question regarding your account, course access, or certificate verification? Our team is here to help.</p>
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 text-xs text-slate-300 space-y-4">
          <div>
            <span className="text-slate-500 font-semibold block mb-1">Support Email</span>
            <a href="mailto:support@pentacourse.com" className="text-emerald-400 font-bold text-sm">support@pentacourse.com</a>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block mb-1">Response Time</span>
            <span>Typically within 24 business hours</span>
          </div>
        </div>
    </main>
  );
}
