'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function CertificationsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight mb-4">
          Cryptographic Certificate Verification
        </h1>
        <p className="text-sm sm:text-base text-slate-400 mb-12">
          Every certificate issued on PentaCourse is sealed with a tamper-proof SHA-256 cryptographic signature, publicly verifiable on our immutable ledger.
        </p>

        <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/40 mb-12">
          <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Verify a Certificate Online
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            Enter the 64-character verification hash found at the bottom of any official PentaCourse certificate document.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const hash = e.target.elements.hash.value.trim();
              if (hash) window.location.href = `/certificates/${hash}`;
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              name="hash"
              placeholder="e.g. 7f8a9b2c3d4e5f60718293a4b5c6d7e8..."
              required
              className="flex-1 px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all"
            >
              Verify Record
            </button>
          </form>
        </div>
    </main>
  );
}
