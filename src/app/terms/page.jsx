'use client';

import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg text-slate-100 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-black flex items-center justify-center">P</span>
            <span>PentaCourse</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-16 text-sm text-slate-300 space-y-6 leading-relaxed">
        <h1 className="text-3xl font-extrabold text-slate-100 mb-6">Terms of Service</h1>
        
        <div id="clinical-disclaimer" className="p-6 rounded-2xl border border-yellow-500/40 bg-yellow-500/10 text-xs text-yellow-200">
          <h2 className="text-sm font-bold text-yellow-100 mb-2">Important Clinical & Educational Disclaimer</h2>
          <p className="leading-relaxed">
            PentaCourse is exclusively an educational training platform. Content within the Clinical Medicine knowledge graph (including Arterial Blood Gas analysis, high anion gap metabolic acidosis, and DKA resuscitation protocols) is provided solely for academic study and conceptual simulation. PentaCourse is NOT a medical device, is NOT intended for clinical diagnostic use, and must NEVER replace the professional judgment of licensed medical personnel.
          </p>
        </div>

        <h2 className="text-base font-bold text-slate-100">1. Acceptable Use</h2>
        <p>
          You agree to use PentaCourse in compliance with all applicable laws. Reverse engineering, automated scraping, or unauthorized sharing of account credentials is strictly prohibited.
        </p>

        <h2 className="text-base font-bold text-slate-100">2. Certificates and Entitlements</h2>
        <p>
          Official certificates are awarded upon verified completion of prerequisite courses and capstone projects. PentaCourse reserves the right to revoke fraudulent certificates.
        </p>
      </main>
    </div>
  );
}
