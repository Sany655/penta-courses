import os

def write_page(path, content):
    p = os.path.normpath(path)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Created {p}")

# Certifications
write_page("src/app/certifications/page.jsx", """'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function CertificationsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg text-slate-100 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-black flex items-center justify-center">P</span>
            <span>PentaCourse</span>
          </Link>
          <Link href="/missions" className="text-xs px-3.5 py-2 rounded-lg bg-emerald-500 text-slate-950 font-semibold">Start Learning</Link>
        </div>
      </nav>

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
    </div>
  );
}
""")

# Certificate View
write_page("src/app/certificates/[hash]/page.jsx", """'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function CertificateVerificationView() {
  const params = useParams();
  const hash = params?.hash;
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!hash) return;
    fetch(`/api/v1/commerce/certificates/verify/${hash}`)
      .then(res => {
        if (!res.ok) throw new Error('Certificate record not found or invalid signature');
        return res.json();
      })
      .then(data => {
        setCert(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [hash]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between">
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg text-slate-100 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-black flex items-center justify-center">P</span>
            <span>PentaCourse Public Ledger</span>
          </Link>
          <Link href="/certifications" className="text-xs text-slate-400 hover:text-emerald-400">Verify Another</Link>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-16 w-full">
        {loading && (
          <div className="text-center py-20 text-xs text-slate-400">
            Verifying cryptographic signature against authoritative state ledger...
          </div>
        )}

        {error && (
          <div className="p-8 rounded-2xl border border-red-500/30 bg-red-500/10 text-center">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-red-200 mb-2">Invalid Certificate Record</h2>
            <p className="text-xs text-slate-400 mb-6">{error}</p>
            <Link href="/certifications" className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-200">Return to Verification Search</Link>
          </div>
        )}

        {cert && (
          <div className="rounded-3xl border-2 border-emerald-500/60 bg-gradient-to-b from-slate-900 to-slate-950 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-3 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
              <CheckCircle2 className="w-5 h-5" />
              <span>Authentic Verified Credential</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mb-2">{cert.title}</h1>
            <p className="text-sm text-cyan-400 font-semibold mb-8">{cert.course_title}</p>

            <div className="space-y-4 text-xs text-slate-300 border-t border-b border-slate-800 py-6 mb-8">
              <div className="flex justify-between">
                <span className="text-slate-500">Recipient</span>
                <span className="font-bold text-slate-100">{cert.recipient_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Issued On</span>
                <span className="text-slate-200">{cert.issued_at ? new Date(cert.issued_at).toLocaleDateString() : 'Official'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Issuer Authority</span>
                <span className="text-slate-200">{cert.issuer || 'PentaCourse'}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-500 break-all">
              <span className="text-slate-400 font-semibold block mb-1">SHA-256 Ledger Signature:</span>
              {cert.verification_hash}
            </div>
          </div>
        )}
      </main>

      <footer className="py-6 text-center text-xs text-slate-600 border-t border-slate-900">
        PentaCourse Verifiable Credentials Ledger • No personal private answers exposed
      </footer>
    </div>
  );
}
""")

# About
write_page("src/app/about/page.jsx", """'use client';

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg text-slate-100 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-black flex items-center justify-center">P</span>
            <span>PentaCourse</span>
          </Link>
          <Link href="/missions" className="text-xs px-3.5 py-2 rounded-lg bg-emerald-500 text-slate-950 font-semibold">Start Learning</Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight mb-6">About PentaCourse</h1>
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <p>
            PentaCourse was founded with a singular purpose: to make learning complex, high-consequence domains dramatically more efficient, rigorous, and personalized.
          </p>
          <p>
            Traditional education treats all learners as a uniform cohort, forcing students through linear video lectures and multiple-choice quizzes that fail to test procedural execution, causal reasoning, or multi-step synthesis.
          </p>
          <p>
            Our Unified Hybrid Adaptive Learning Platform replaces passive video consumption with interactive cognitive sandboxes, topological Directed Acyclic Graphs, and a 5-Dimensional competence vector across Recall, Explanation, Application, Implementation, and Creation.
          </p>
        </div>
      </main>
    </div>
  );
}
""")

# Privacy
write_page("src/app/privacy/page.jsx", """'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-extrabold text-slate-100 mb-6">Privacy Policy</h1>
        <p className="text-xs text-slate-400">Last updated: August 31, 2026</p>
        <p>
          At PentaCourse, we believe learner privacy is paramount. We do not sell your learning data, interaction history, or personal details to advertisers.
        </p>
        <h2 className="text-base font-bold text-slate-100">1. Information We Collect</h2>
        <p>
          We collect your email address, name, learning session interaction logs (time-on-task, exercise scores), and payment confirmation references necessary to grant entitlements.
        </p>
        <h2 className="text-base font-bold text-slate-100">2. How We Use Learning Telemetry</h2>
        <p>
          Interaction signals (e.g. hesitation scores, activity completion) are used strictly to calibrate your 5-Dimensional mastery vector and compute optimal prerequisite recommendations.
        </p>
        <h2 className="text-base font-bold text-slate-100">3. Third-Party Payment Processors</h2>
        <p>
          All credit card and mobile financial transactions are processed securely via Stripe and bKash. We never store raw credit card numbers or PINs on our servers.
        </p>
      </main>
    </div>
  );
}
""")

# Terms
write_page("src/app/terms/page.jsx", """'use client';

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
""")

# Refund
write_page("src/app/refund/page.jsx", """'use client';

import React from 'react';
import Link from 'next/link';

export default function RefundPage() {
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
    </div>
  );
}
""")

# Contact
write_page("src/app/contact/page.jsx", """'use client';

import React from 'react';
import Link from 'next/link';

export default function ContactPage() {
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
    </div>
  );
}
""")
